import React, {useEffect} from 'react';
import diff from "../svg/diff.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import canDisplayDiffFilter from "../redux/filter/canDisplayDiffFilter";
import { toggleDiff } from "../redux/slice/toggleDiffSlice";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';

const DiffButton = () => {

    const { id } = useParams();

    const toggleName = 'diff';
    // on ne montre ce boutton que :
    // si - j'ai souscrit au document
    // si - il y a des modifications en cours
    // si - je suis propriétaire des modification
    // si - je ne suis pas propriétaire des modification elle sont readyForVote

    const canDisplay = useSelector(canDisplayDiffFilter(id));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initOne({id : toggleName}));
    }, [])

    const toggle = () => {
        dispatch(toggleDiff({ id : id }));
        dispatch( toggleBarre({id : toggleName}));
    }

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <img onClick={toggle} className="logo " src={diff} alt="Amend"/>
            </div> : <></> }
        </>
    )
}
export default DiffButton;