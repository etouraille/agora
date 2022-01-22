import React, {useEffect, useState} from 'react';
import vote from "../svg/vote.svg";
import {useDispatch, useSelector} from "react-redux";
import canDisplayVoteFilter from "../redux/filter/canDisplayVoteFilter";
import Vote from "../vote/Vote";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import {reload as reloadDocument } from "./../redux/slice/reloadDocumentSlice";
import ModalBarre from "./ModalBarre";
import Attachement from "../document/vote/Attachement";

const VoteButton = ({id}) => {

    const canDisplay = useSelector(canDisplayVoteFilter(id));



    const [ open, setOpen ] = useState(false);

    const toggle = (evt) => {
        evt.stopPropagation();
        setOpen(!open);
    }

    const dispatch = useDispatch();

    const forceReload = () => {
        dispatch(reloadDocument({id}));
    }

    return (
        <>
            { canDisplay ?
                <>
                    <div className="barre-elem">
                        <img className="logo " src={vote} alt="Vote" onClick={toggle}/>
                        <div>
                            <ModalBarre
                                title={`Vote`}
                                open={open}
                                setOpen={setOpen}
                                content={() => <><Vote id={id} forceReload={forceReload}></Vote><Attachement id={id}></Attachement></>}
                            ></ModalBarre>

                        </div>
                    </div>
                </>
                : <></>
            }
        </>
    )
}
export default VoteButton;
