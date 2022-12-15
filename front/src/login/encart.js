import React, { useState, useEffect } from 'react';
import { useSelector , useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import http from "../http/http";
import { login, logout } from "../redux/slice/loginSlice";
import {Link, useLocation} from 'react-router-dom';
import usePrevious from "../utils/usePrevious";
import {init} from "../redux/slice/subscribedSlice";
import { initNotification } from "../redux/slice/notificationSlice";
import Subscribe from "./../mercure/subscribe";
import documentSubscribeFilters from "../redux/filter/documentSubscribeFilters";
import _ from 'lodash'
import {initDocumentsSubscribe} from "../redux/slice/documentSubscribeSlice";
import { GoogleLogout } from 'react-google-login';

/*global FB*/

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

    const userId = useSelector( state => {
        return state.login.userId;
    })

    const click = useSelector(state => state.click.click);

    const prevClick = usePrevious(click);

    const location = useLocation();

    const noPing = [/^\/$/, /\/user\/(.*)$/, /\/subscribe$/, /\/new-password$/, /\/reset-password$/];

    useEffect(() => {
        if( click > 0 && click > prevClick ) {
            setSelected(false);
        }
    }, [click, prevClick])

    const  mercure  = new Subscribe();

    const subscribedDoc = useSelector( documentSubscribeFilters);

    useEffect(() => {


        if (-1 === noPing.findIndex(elem => location.pathname.match(elem))) {


            http.get('/api/ping').then(
                data => {
                    dispatch(login({token: localStorage.getItem('token'), userId: data.data.userId, email: data.data.email}));
                },
                error => {
                    dispatch(logout());
                });
        }

    }, [location.pathname])


    useEffect(() => {
        window.onbeforeunload = () => {
            mercure.closeAll();
        }
    }, [])

    const previousSD = usePrevious(subscribedDoc);

    useEffect( ()=> {
        if( -1 === noPing.findIndex(elem => location.pathname.match(elem))) {
            //console.log( previousUser, subscribedDoc , _.isEqual( previousSD, subscribedDoc) )
            if (!_.isEqual(previousSD ? previousSD.sort() : null, subscribedDoc ? subscribedDoc.sort() : null)) {
                //console.log ( subscribedDoc );
                mercure.init(userId, subscribedDoc);
                //console.log( subscribedDoc );
                //console.log( 'init =============')
            }

            return () => {
                mercure.close();
            }
        }

    }, [subscribedDoc, location.pathname])

    const previousUser = usePrevious(userId );

    useEffect(() => {
        if( previousUser !== userId && -1 === noPing.findIndex(elem => location.pathname.match(elem))) {
            mercure.init(userId, subscribedDoc );
            http.get('/api/subscribed-doc').then( data => {
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
    }, [userId]);

    const Logged = () => {

        const logged = on ?
        <div>
            <div className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button"
               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={evt => { evt.stopPropagation();setSelected(!selected)}}>
                { jwtDecode(token).name ? jwtDecode(token).name : jwtDecode(token).email }
            </div>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink" style={{ display : selected ? 'inline' : 'none'}}>
                <Link className="dropdown-item"  to="/documents" onClick={evt => setSelected(!selected)}>Liste des Documents</Link>
                <Link className="dropdown-item"  to="/document" onClick={evt => setSelected(!selected)}>Créer un document</Link>
                { jwtDecode(token).isGoogle ? <GoogleLogout
                    clientId={process.env.REACT_APP_google_key}
                    buttonText="Logout"
                    onLogoutSuccess={evt => unlog()}
                ></GoogleLogout> : (jwtDecode(token).isFacebook ?
                        <div className="dropdown-item"  onClick={evt => { FB.logout();unlog();}}>Unlog</div> :
                        <div className="dropdown-item"  onClick={evt => unlog()}>Unlog</div>)
                }

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
