import React, {useState} from 'react';
import http from "../http/http";
import {useDispatch} from "react-redux";
import { removeNotification } from "../redux/slice/notificationSlice";
import history from "../utils/history";


const NotifItem = ({ notification }) => {

    const dispatch = useDispatch();

    let link = null;
    let id = notification.id;
    let body = notification.notification.body;
    let type = notification.notification.type;
    let notifId = notification.notification.id;
    let title = notification.title;
    const regexp = /\{doc\}/


    const html = () => {

        if ( type === 'invite' ) {
            body = body.replace(regexp, '<a href="' + process.env.REACT_APP_front +'/documentedit/' + id + '">' + title + '</a>');
            link = '/documentedit/' + id;
        } else if ( type === 'rfv' || type === 'voteSuccess' || type === 'voteFail' ) {
            body = body.replace(regexp, '<a href="' + process.env.REACT_APP_front +'/document/' + id + '">' + title +'</a>');
            link = '/document/' + id ;
        }
        return { __html : body };
    }

    const reset = () => {
        if( type !== 'invite' && type !== 'rfv' ) {
            http.post('/api/notification/clear', {id: notifId}).then(data => {
                console.log(data);
                history.push( link );
                dispatch(removeNotification({id: notifId}));
            }, error => {
                console.log(error);
            })
        } else {
            history.push( link );
        }
    }

    return (
        <div onClick={reset} dangerouslySetInnerHTML={html()}></div>
    )
}
export default NotifItem;
