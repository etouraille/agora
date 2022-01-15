import React, { useState, useEffect } from 'react';
import { useSelector , useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import http from "../http/http";
import { login, logout } from "../redux/slice/loginSlice";
import { Link } from 'react-router-dom';
import usePrevious from "../utils/usePrevious";
import {init} from "../redux/slice/subscribedSlice";
import { initNotification } from "../redux/slice/notificationSlice";
import Subscribe from "./../mercure/subscribe";
import documentSubscribeFilters from "../redux/filter/documentSubscribeFilters";
import _ from 'lodash'
import {initDocumentsSubscribe} from "../redux/slice/documentSubscribeSlice";

function unlog() {
    window.localStorage.setItem('token', null);
    http.get('api/ping')
}

const Encart = () => {

    const token = useSelector( state =>  state.login.token );

    const [selected , setSelected ] = useState( false );


    const dispatch = useDispatch();

    const on = useSelector(state => {
        return state.login.logged
    });

    const user = useSelector( state => {
        return state.login.user;
    })

    const click = useSelector(state => state.click.click);

    const prevClick = usePrevious(click);

    useEffect(() => {
        if( click > 0 && click > prevClick ) {
            setSelected(false);
        }
    }, [click, prevClick])

    const  mercure  = new Subscribe();

    const subscribedDoc = useSelector( documentSubscribeFilters);

    useEffect(() => {
        http.get('/api/ping').then(
            data => {
                dispatch( login({ token  : localStorage.getItem('token'), user: data.data.user  }));
            },
            error => {
                dispatch( logout());
            });

    }, [])


    useEffect(() => {
        window.onbeforeunload = () => {
            mercure.closeAll();
        }
    }, [])

    const previousSD = usePrevious(subscribedDoc);

    useEffect( ()=> {
        //console.log( previousUser, subscribedDoc , _.isEqual( previousSD, subscribedDoc) )
        if( ! _.isEqual( previousSD ? previousSD.sort() : null,  subscribedDoc ? subscribedDoc.sort(): null)) {
            //console.log ( subscribedDoc );
            mercure.init(user, subscribedDoc);
            //console.log( subscribedDoc );
            //console.log( 'init =============')
        }
        return () => {
            mercure.close();
        }

    }, [subscribedDoc])

    const previousUser = usePrevious(user );

    useEffect(() => {
        if( previousUser !== undefined && previousUser !== user ) {
            mercure.init(user, subscribedDoc );
            http.get('/api/subscribed-doc').then( data => {
                //console.log( data.data );
                dispatch(init({data : data.data }));
            }, error => {
                console.log( error );
            })
            http.get('/api/notification').then( data => {
                dispatch( initNotification({data : data.data }));
            })
            http.get('/api/documents').then(
                data => {
                    dispatch(initDocumentsSubscribe({data: data.data}));
                }, error => {
                    console.log(error);
           });

        }
        return () => {
            mercure.close();
        }
    }, [user]);

    const Logged = () => {

        const logged = on ?
        <div>
            <div className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button"
               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={evt => { evt.stopPropagation();setSelected(!selected)}}>
                { jwtDecode(token).username }
            </div>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink" style={{ display : selected ? 'inline' : 'none'}}>
                <Link className="dropdown-item"  to="/documents" onClick={evt => setSelected(!selected)}>Liste des Documents</Link>
                <Link className="dropdown-item"  to="/document" onClick={evt => setSelected(!selected)}>Créer un document</Link>
                <Link className="dropdown-item"  onClick={evt => unlog()}>Unlog</Link>
            </div>
        </div> : <div></div> ;

        return logged;

    }

    return (
        <div>
            {Logged()}
        </div>
    )

}
export default Encart;
