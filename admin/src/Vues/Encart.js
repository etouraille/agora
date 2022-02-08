import React, { useState, useEffect } from 'react';
import { useSelector , useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import http from "../http/http";
import { login, logout } from "../redux/slice/loginSlice";
import {Link, useLocation} from 'react-router-dom';
import usePrevious from "../utils/usePrevious";
import {useNavigate} from "react-router";

/*global FB*/


const Encart = () => {

    const navigate = useNavigate();

    function unlog() {
        window.localStorage.setItem('token', null);
        http.get('api/ping');

    }


    const token = useSelector( state =>  state.login.token );

    const [selected , setSelected ] = useState( false );


    const dispatch = useDispatch();

    const on = useSelector(state => {
        return state.login.logged
    });

    const userId = useSelector( state => {
        return state.login.userId;
    })


    const location = useLocation();

    console.log(location);

    const noPing = [/\/login$/ , /\/user\/(.*)$/, /\/subscribe$/];

    useEffect(() => {

        console.log( 'pathname ===============', location.pathname, location.pathname.match(/^\/$/));

        if (-1 === noPing.findIndex(elem => location.pathname.match(elem))) {

             console.log( 'not matched');

            http.get('/api/ping').then(
                data => {
                    dispatch(login({token: localStorage.getItem('token'), userId: data.data.userId, email: data.data.email}));
                },
                error => {
                    dispatch(logout());
                });
        }

    }, [location.pathname])




    const Logged = () => {

        const logged = on ?
        <div>
            <div className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button"
               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={evt => { evt.stopPropagation();setSelected(!selected)}}>
                { jwtDecode(token).name ? jwtDecode(token).name : jwtDecode(token).email }
            </div>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink" style={{ display : selected ? 'inline' : 'none'}}>
                <Link className="dropdown-item"  to="/documents" onClick={evt => setSelected(!selected)}>Liste des Documents</Link>
                <Link className="dropdown-item"  to="/users" onClick={evt => setSelected(!selected)}>Liste des utilisateurs</Link>
                <div className="dropdown-item"  onClick={evt => unlog()}>Unlog</div>
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
