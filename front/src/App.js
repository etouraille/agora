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
import useSwipePrevious from "./swipeable/useSwipePrevious";

/*global FB*/

export default function App() {



    const dispatch = useDispatch();

    const location = useLocation();

    const { ref } = useSwipePrevious();

    useEffect(() => {
       ref(document);
    }, [])

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

        if( -1 === _routes.findIndex(elem => location.pathname.match(elem.regexp))) {
            history.push('/404');
        }

    }, [location.pathname])

    useEffect(() => {
        document.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
        })

        return () => {
            document.removeEventListener('contextmenu', (evt) => {
                evt.preventDefault();
            })

        }
    }, []);

    //facebook
    useEffect(() => {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : process.env.REACT_APP_facebookId,
                cookie     : true,
                xfbml      : true,
                version    : 'v12.0'
            });

            FB.AppEvents.logPageView();

        };

    }, []);

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

