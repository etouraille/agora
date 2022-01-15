import React, {useEffect, useState} from 'react';
import notif_black from "../svg/notif_black.svg";
import notif_white from "../svg/notif_white.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import Subscribe from "../document/subscribe/Subscribe";
import NotificationList from "../notification/NotficationList";
import ModalBarre from "./ModalBarre";

const Notif = () => {

    const toggleName = 'notif';


    const notifications = useSelector( state => state.notification.notification );

    const [open, setOpen] = useState(false);


    const click = (evt) => {
        evt.stopPropagation();console.log(1);
        setOpen(!open);
    }

    return (
        <>
            <div className="barre-elem">
                { notifications.length > 0  ? <img className="logo" src={notif_white} onClick={click} alt="Notificaiton"/> :
                    <img className="logo" src={notif_black} onClick={click} alt="Notificaiton"/>
                }
                { notifications.length > 0  ? <div>
                    <ModalBarre title={`Notification`} open={open} setOpen={setOpen} content={() => <NotificationList notifications={notifications}></NotificationList>}></ModalBarre>

                </div> : <></> }
            </div>
        </>
    )
}
export default Notif;
