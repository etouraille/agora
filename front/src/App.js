import React, {useEffect} from 'react';
import Encart from "./login/encart";
import {
    Switch,
    Route,
    Link
} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {add} from "./redux/slice/clickSlice";
import { useLocation } from 'react-router-dom';
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
            console.log('init facebook');
            //FB.AppEvents.logPageView();

        };

    }, [location.pathname]);

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

