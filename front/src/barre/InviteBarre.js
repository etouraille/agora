import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import invite from "../svg/invite.svg";
import Invite from "../invite/Invite";
import {useParams} from "react-router";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import ModalBarre from "./ModalBarre";

const InviteBarre = () => {

    const { id } = useParams();

    const toggleName = 'invite';

    const [open, setOpen] = useState(false);



    const toggle = (evt) => {
        evt.stopPropagation();
        setOpen(!open);
    }

    return (
        <>
            <div className="barre-elem">
                <img className="logo " src={invite} alt="Invite" onClick={toggle}/>
                <div>
                    <ModalBarre open={open} setOpen={setOpen} content={() => <Invite id={id}></Invite>}/>
                </div>

            </div>
        </>
    )

}
export default InviteBarre;
