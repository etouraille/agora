import React from 'react';
import {useSelector} from "react-redux";
import NotifItem from "./NotifItem";

const NotificationList = ({ notifications , setClose}) => {


    return (
        <>
            { notifications.map((elem , index ) => {
                return (<NotifItem key={index} notification={elem} setClose={setClose}></NotifItem>)
            })}
        </>
    )
}
export default NotificationList;