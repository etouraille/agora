import Login from './Login';
import SubscribeForm from './subscribe/SubscribeForm';
import React from 'react';
import Encart from "./login/encart";
import DocumentList from "./document/List";
import Document from './document/Document';
import DocumentEdit from "./document/DocumentEdit";
import DocumentView from "./document/DocumentView";
import Invite from "./invite/Invite";
import {
    Switch,
    Route,
    Link
} from 'react-router-dom';

export default function App() {
    return (

            <div>
                <nav className="navbar navbar-light bg-light">
                    <ul className="nav">
                        <li className="nav-item active">
                            <Link to="/home" className="nav-link">Home</Link>
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
                        <Route path="/home">
                            <Home></Home>
                        </Route>
                        <Route path="/documents">
                            <DocumentList></DocumentList>
                        </Route>
                        <Route path="/documentedit/:id">
                            <DocumentEdit></DocumentEdit>
                        </Route>
                        <Route path="/document/:id">
                            <DocumentView></DocumentView>
                        </Route>
                        <Route path="/document">
                            <Document></Document>
                        </Route>
                        <Route path="/invite/:id">
                            <Invite></Invite>
                        </Route>
                    </Switch>
                </div>
            </div>
    );
}

function Home() {
    return (
        <h1>Home</h1>
    )
}