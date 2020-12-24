import React, { useState, useEffect } from 'react';
import { useSelector , useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import http from "../http/http";
import { login, logout } from "../redux/slice/loginSlice";
import { Link } from 'react-router-dom';
import usePrevious from "../utils/usePrevious";
import {init} from "../redux/slice/subscribedSlice";
import Subscribe from "./../mercure/subscribe";
import documentSubscribeFilters from "../redux/filter/documentSubscribeFilters";
const Encart = () => {

    const dispatch = useDispatch();

    const on = useSelector(state => {
        return state.login.logged
    });

    const user = useSelector( state => {
        return state.login.user;
    })


    const subscribedDoc = useSelector( documentSubscribeFilters);

    const mercure = new Subscribe();

    useEffect(() => {
        http.get('/api/ping').then(
            data => {
                dispatch( login({ token  : localStorage.getItem('token'), user: data.data.user  }));
            },
            error => {
                dispatch( logout());
            });
    }, [])


    useEffect( ()=> {
        mercure.init(user, subscribedDoc );

        return () => {
            mercure.close();
        }

    }, [subscribedDoc])

    const previousUser = usePrevious(user );

    useEffect(() => {
        if( previousUser !== undefined && previousUser !== user ) {
            mercure.init(user, subscribedDoc );
            http.get('/api/subscribed-doc').then( data => {
                dispatch(init({data : data.data }));
            }, error => {
                console.log( error );
            })
        }
        return () => {
            mercure.close();
        }
    }, [user]);
    const token = useSelector( state =>  state.login.token );

    const [selected , setSelected ] = useState( false );

    const Logged = () => {

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