import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import http from "../http/http";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slice/loginSlice";
import { Link } from 'react-router-dom';
import usePrevious from "../utils/usePrevious";
import {init} from "../redux/slice/subscribedSlice";
import Subscribe from "./../mercure/subscribe";
const Encart = () => {

    const dispatch = useDispatch();

    const on = useSelector(state => {
        return state.login.logged
    });

    const user = useSelector( state => {
        return state.login.user;
    })



    const subscribed = useSelector( state => state.subscribed.subscribed );

    const mercure = new Subscribe(dispatch);


    useEffect ( () => {
        if( subscribed.length > 0 ) {
            mercure.setVars( subscribed , user );
        }

    }, [subscribed, user, mercure ])

    const previousUser = usePrevious(user );

    useEffect(() => {
        if( previousUser !== undefined && previousUser !== user ) {
            mercure.close();
            mercure.init();
            http.get('/api/subscribed-doc').then( data => {
                console.log ( data.data );
                dispatch(init({data : data.data }));
            }, error => {
                console.log( error );
            })
        }
    }, [user]);
    const token = useSelector( state =>  state.login.token );

    const [selected , setSelected ] = useState( false );

    const Logged = () => {

        http.get('/api/ping').then(
            data => {
                dispatch( login({ token  : localStorage.getItem('token'), user: data.data.user  }));
            },
            error => {
                dispatch( logout());
        });


        const logged = on ?
        <div>
            <div className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button"
               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={evt => setSelected(!selected)}>
                { jwtDecode(token).username }
            </div>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink" style={{ display : selected ? 'inline' : 'none'}}>
                <Link className="dropdown-item"  to="/documents" onClick={evt => setSelected(!selected)}>Liste des Documents</Link>
                <Link className="dropdown-item"  to="/document" onClick={evt => setSelected(!selected)}>Créer un document</Link>
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