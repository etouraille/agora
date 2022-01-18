import Login from './Login';
import SubscribeForm from './subscribe/SubscribeForm';
import React, {useEffect} from 'react';
import Encart from "./login/encart";
import Document from './document/Document';
import DocumentEdit from "./document/DocumentEdit";
import DocumentView from "./document/DocumentView";
import InviteNavigate from "./invite/InviteNavigate";
import {
    Switch,
    Route,
    Link
} from 'react-router-dom';
import Barre from "./barre/Barre";
import Search from "./document/search/Search";
import _403 from "./403";
import {useDispatch} from "react-redux";
import {add} from "./redux/slice/clickSlice";
import UploadFile from "./upload/UploadFile";
import Home from "./Home";
import { useLocation } from 'react-router-dom';
import User from "./user/User";
import _404 from "./404";
import _routes from './route'
import history from "./utils/history";


export default function App() {

    const dispatch = useDispatch();

    const location = useLocation();

    console.log( location );

    // writting the previous url
    useEffect(() => {
        let currentUrl = location.pathname;
        window.localStorage.setItem('redirect', window.localStorage.getItem('currentUrl'));
        window.localStorage.setItem('previousUrl', window.localStorage.getItem('currentUrl'));
        if( ! currentUrl.match(/\/login/)) {
            window.localStorage.setItem('currentUrl', currentUrl);
        }

    }, [location.pathname])


    useEffect(() => {

        console.log( location.pathname);
        console.log( _routes.findIndex(elem => location.pathname.match(elem.regexp)));

        if( -1 === _routes.findIndex(elem => location.pathname.match(elem.regexp))) {
            console.log( 'match fail ===================');
            history.push('/404');
        }

    }, [location.pathname])

    const click = (evt) => {
        evt.preventDefault();
        dispatch(add());
    }

    return (
            <>
                <div onClick={(evt)=> click(evt)} className="app">
                    <nav className="navbar navbar-light bg-light">
                        <ul className="nav">
                            <li className="nav-item active">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/subscribe" className="nav-link">Inscription</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">Connexion</Link>
                            </li>
                        </ul>
                        <Encart></Encart>
                    </nav>
                    <div className="container">
                        <Switch>
                            {_routes.map((elem, index) => <Route path={elem.path}>{elem.html()}</Route>)}
                        </Switch>
                    </div>
                </div>
            </>
    );
}

