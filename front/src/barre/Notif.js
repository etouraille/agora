import React, {useEffect, useState} from 'react';
import notif_black from "../svg/notif_black.svg";
import notif_white from "../svg/notif_white.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import Subscribe from "../document/subscribe/Subscribe";
import NotificationList from "../notification/NotficationList";

const Notif = () => {

    const toggleName = 'notif';

    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );

    const { id } = useParams();

    const canDisplay = true;

    const dispatch = useDispatch();

    const display = useSelector(barreToggleFilter(toggleName));

    const notifications = useSelector( state => state.notification.notification );

    useEffect(() => {
        if( display ) {
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        } else {
            setVisibility('hidden');
            setOpacity(0);
            setZIndex(-1 );
        }
    }, [display ])


    useEffect(() => {
        dispatch( initOne( { id : toggleName }));
    }, [])


    const click = () => {
        dispatch( toggleBarre({id : toggleName}));
    }

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                { notifications.length > 0  ? <img className="logo" src={notif_white} onClick={click} alt="Notificaiton"/> :
                    <img className="logo" src={notif_black} onClick={click} alt="Notificaiton"/>
                }
                <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content left-content-invite">
                    <NotificationList notifications={notifications}></NotificationList>
                </div>
            </div> : <></> }
        </>
    )
}
export default Notif;