import React from 'react';
import {useSelector} from "react-redux";
import NotifItem from "./NotifItem";

const NotificationList = ({ notifications }) => {


    return (
        <>
            { notifications.map((elem , index ) => {
                return (<NotifItem key={index} notification={elem}></NotifItem>)
            })}
        </>
    )
}
export default NotificationList;