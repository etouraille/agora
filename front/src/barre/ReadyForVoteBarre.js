import React, {useEffect, useState} from 'react';
import diff from "../svg/diff.svg";
import ok from '../svg/positive-vote.svg'
import {useParams} from "react-router";
import ReadyForVote from "../vote/ReadyForVote";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import {useDispatch, useSelector} from "react-redux";
import ModalBarre from "./ModalBarre";
const ReadyForVoteBarre = () => {

    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const toggle = (evt) => {
        evt.stopPropagation();
        setOpen(!open)
    }

    return (
        <>
            <div className="barre-elem">
                <img onClick={toggle} className="logo " src={ok} alt="Amend"/>
                <div>
                    <ModalBarre
                        open={open}
                        setOpen={setOpen}
                        title={`Ready for vote`}
                        content={() => <ReadyForVote id={id}></ReadyForVote>}
                     />
                </div>
            </div>
        </>
    )
}
export default ReadyForVoteBarre;
