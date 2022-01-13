import React, {useEffect, useState} from 'react';
import diff from "../svg/diff.svg";
import ok from '../svg/positive-vote.svg'
import {useParams} from "react-router";
import ReadyForVote from "../vote/ReadyForVote";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import {useDispatch, useSelector} from "react-redux";
const ReadyForVoteBarre = () => {

    const toggleName = 'rfv';

    const [ visibility , setVisibility ] = useState( 'hidden');
    const [ opacity , setOpacity ] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );
    const canDisplay = true;

    const { id } = useParams();

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(initOne({id : toggleName }));
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

    const toggle = (evt) => {
        evt.stopPropagation();console.log(1);
        dispatch(toggleBarre({id : toggleName}));
    }

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <img onClick={toggle} className="logo " src={ok} alt="Amend"/>
                <div className="left-content" style={{visibility, opacity, zIndex }}><ReadyForVote id={id}></ReadyForVote></div>
            </div> : <></> }
        </>
    )
}
export default ReadyForVoteBarre;
