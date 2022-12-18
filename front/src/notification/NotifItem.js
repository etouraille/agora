import React, {useState} from 'react';
import http from "../http/http";
import {useDispatch} from "react-redux";
import { removeNotification } from "../redux/slice/notificationSlice";
import history from "../utils/history";


const NotifItem = ({ notification , setClose}) => {

    const dispatch = useDispatch();

    let link = null;
    let id = notification.id;
    let body = notification.notification.body;
    let type = notification.notification.type;
    let notifId = notification.notification.id;
    let title = notification.title;
    const regexp = /\{doc\}/



    const html = () => {

        if ( type === 'invite' || type === 'newRound' || type === 'roundVoteFail' ) {
            body = body.replace(regexp, '<a href="' + process.env.REACT_APP_front +'/documentedit/' + id + '">' + title + '</a>');
            link = '/documentedit/' + id;
        } else if ( type === 'rfv' || type === 'voteSuccess' || type === 'voteFail' || 'invite-email') {
            body = body.replace(regexp, '<a href="' + process.env.REACT_APP_front +'/document/' + id + '">' + title +'</a>');
            link = '/document/' + id ;
        }
        return { __html : body };
    }


    const reset = () => {
        //if( type !== 'invite' && type !== 'rfv' ) {
        if(type) {
            http.post('/api/notification/clear', {id: notifId}).then(data => {
                history.push( link );
                dispatch(removeNotification({id: notifId}));
                setClose();
            }, error => {
                console.log(error);
            })
        } else {

            history.push( link );
            setClose()
        }
    }

    return (
        <>
            <div onClick={reset} dangerouslySetInnerHTML={html()}></div>
        </>
    )
}
export default NotifItem;
