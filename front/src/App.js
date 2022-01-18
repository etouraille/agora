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


export default function App() {

    const dispatch = useDispatch();

    const location = useLocation();

    console.log( location );

    useEffect(() => {
        let currentUrl = location.pathname;
        window.localStorage.setItem('redirect', window.localStorage.getItem('currentUrl'));
        window.localStorage.setItem('previousUrl', window.localStorage.getItem('currentUrl'));
        if( ! currentUrl.match(/\/login/)) {
            window.localStorage.setItem('currentUrl', currentUrl);
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
                            <Route path="/subscribe">
                                <SubscribeForm></SubscribeForm>
                            </Route>
                            <Route path="/login">
                                <Login></Login>
                            </Route>
                            <Route path="/documents">
                                <Barre></Barre>
                                <Search></Search>
                            </Route>
                            <Route path="/documentedit/:id">
                                <Barre></Barre>
                                <DocumentEdit></DocumentEdit>
                            </Route>
                            <Route path="/document/:id">
                                <Barre></Barre>
                                <DocumentView></DocumentView>
                            </Route>
                            <Route path="/document">
                                <Document></Document>
                            </Route>
                            <Route path="/invite/:id">
                                <InviteNavigate></InviteNavigate>
                            </Route>
                            <Route path="/403">
                                <_403></_403>
                            </Route>
                            <Route path="/user/:id">
                                <User></User>
                            </Route>
                            <Route path="/">
                                <Home></Home>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </>
    );
}

