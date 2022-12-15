import {Route} from "react-router-dom";
import SubscribeForm from "./subscribe/SubscribeForm";
import Login from "./Login";
import Barre from "./barre/Barre";
import Search from "./document/search/Search";
import DocumentEdit from "./document/DocumentEdit";
import DocumentView from "./document/DocumentView";
import DocumentAmend from "./document/DocumentAmend";
import Document from "./document/Document";
import InviteNavigate from "./invite/InviteNavigate";
import _403 from "./403";
import _404 from "./404";
import User from "./user/User";
import Home from "./Home";
import React from "react";
import ResetPassword from "./password/ResetPassword";
import NewPassword from "./password/NewPassword";

const _routes = [
    { path:  "/subscribe", regexp: /\/subscribe$/, html : () => <SubscribeForm></SubscribeForm> },
    { path : "/login", regexp: /\/login$/, html : () => <Login></Login>},
    { path : "/reset-password", regexp: /\/reset-password$/, html : () => <ResetPassword></ResetPassword>},
    { path : "/new-password", regexp: /\/new-password$/, html : () => <NewPassword></NewPassword>},
    { path: "/documents", regexp: /\/documents$/,html: () => <><Barre></Barre><Search></Search></> },
    { path: "/documentedit/:id", regexp: /\/documentedit\/(.*)/, html: () => <><Barre></Barre><DocumentEdit></DocumentEdit></>},
    { path: "/documentamend/:id", regexp: /\/documentamend\/(.*)/, html: () => <><Barre></Barre><DocumentAmend></DocumentAmend></>},
    { path: '/document/:id', regexp: /\/document\/(.*)/, html: () => <><Barre></Barre><DocumentView></DocumentView></>},
    { path : "/document", regexp: /\/document$/ ,html: () => <Document></Document> },
    { path: '/invite/:id', regexp: /\/invite\/(.*)/ ,html: () => <InviteNavigate></InviteNavigate>},
    { path: '/403', regexp: /\/403$/ , html: () => <_403></_403>},
    { path: '/404', regexp: /\/404$/ ,html: () => <_404/>},
    { path: '/user/:id', regexp: /\/user\/(.*)/ ,html: () => <User></User>},
    { path : '/', regexp: /^\/$/ ,html: () => <Home></Home>}
]

export default _routes;
