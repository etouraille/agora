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
import { toast, ToastContainer } from "react-toastify";
import usePrevious from "../utils/usePrevious";

const Notif = () => {

    const toggleName = 'notif';


    const notifications = useSelector( state => state.notification.notification );

    const [open, setOpen] = useState(false);

    let previous = usePrevious(notifications.length)

    useEffect(() => {
        if (previous !== notifications.length && notifications.length > previous) {
            toast.error('Nouvelle notification');
        }
    }, [notifications.length ])

    const click = (evt) => {
        evt.stopPropagation();
        setOpen(!open);
    }

    return (
        <>
            <div className="barre-elem">
                { notifications.length > 0  ? <>
                        <img className="logo" src={notif_white} onClick={click} alt="Notificaiton"/>
                        <div className="notif">{ notifications.length }</div>
                        </>:
                        <img className="logo" src={notif_black} onClick={click} alt="Notificaiton"/>
                }
                { notifications.length > 0  ? <div>
                    <ModalBarre title={`Notification`} open={open} setOpen={setOpen} content={() => <NotificationList notifications={notifications}></NotificationList>}></ModalBarre>

                </div> : <></> }
            </div>
            <ToastContainer></ToastContainer>
        </>
    )
}
export default Notif;
