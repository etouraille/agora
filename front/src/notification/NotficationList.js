import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import NotifItem from "./NotifItem";
import http from "../http/http";
import {removeNotification} from "../redux/slice/notificationSlice";

const NotificationList = ({ notifications , setClose}) => {

    const dispatch = useDispatch();

    const clear = () => {
        notifications.forEach((notification) => {
            let notifId = notification.notification.id;
            http.post('/api/notification/clear', {id: notifId}).then(data => {
                dispatch(removeNotification({id: notifId}));
                setClose();
            }, error => {
                console.log(error);
            })
        })
    }

    return (
        <>
            <a className="btn btn-danger" onClick={() => clear()}>Mark everithing as read</a>
            { notifications.map((elem , index ) => {
                return (<NotifItem key={index} notification={elem} setClose={setClose}></NotifItem>)
            })}
        </>
    )
}
export default NotificationList;