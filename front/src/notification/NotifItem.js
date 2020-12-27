import React from 'react';
import http from "../http/http";
import {useDispatch} from "react-redux";
import { removeNotification } from "../redux/slice/notificationSlice";

const NotifItem = ({ notification }) => {

    const dispatch = useDispatch();

    let id = notification.id;
    let body = notification.notification.body;
    let type = notification.notification.type;
    let notifId = notification.notification.id
    const regexp = /\{doc\}/

    const html = () => {

        if ( type === 'invite' ) {
            body = body.replace(regexp, '<a href="http://localhost:3000/documentedit/' + id + '">Edit</a>');
        }
        if ( type === 'rfv' || type === 'voteSuccess' || type === 'voteFail' ) {
            body = body.replace(regexp, '<a href="http://localhost:3000/document/' + id + '">Edit</a>');
        }
        return { __html : body };
    }

    const reset = () => {
        console.log( 'reset');
        http.post('/api/notification/clear',{ id : notifId }).then( data => {
            console.log( data );
            dispatch( removeNotification( { id : notifId }));
        }, error => {
            console.log( error );
        })
    }

    return (
        <div onClick={reset} dangerouslySetInnerHTML={html()}></div>
    )
}
export default NotifItem;