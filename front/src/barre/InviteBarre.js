import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import invite from "../svg/invite.svg";
import Invite from "../invite/Invite";
import {useParams} from "react-router";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";

const InviteBarre = () => {
    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );

    const { id } = useParams();
    const canDisplay = true;

    const toggleName = 'invite';

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initOne({id : toggleName}));
    }, [])

    const display = useSelector(barreToggleFilter(toggleName));

    useEffect(() => {
        if( display) {
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        } else {
            setVisibility('hidden');
            setOpacity(0);
            setZIndex(-1 );
        }
    }, [display])

    const toggle = () => {
        dispatch( toggleBarre({ id : toggleName}));
    }

    return (
        <>
            { canDisplay ?
                <div>
                    <div className="barre-elem">
                        <img className="logo " src={invite} alt="Invite" onClick={toggle}/>
                        <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content left-content-invite">
                            <Invite id={id}></Invite>
                        </div>
                    </div>

                </div>
                : <></>
            }
        </>
    )

}
export default InviteBarre;