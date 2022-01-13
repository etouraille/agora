import React, {useEffect, useState} from 'react';
import vote from "../svg/vote.svg";
import {useDispatch, useSelector} from "react-redux";
import canDisplayVoteFilter from "../redux/filter/canDisplayVoteFilter";
import Vote from "../vote/Vote";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import {reload as reloadDocument } from "./../redux/slice/reloadDocumentSlice";

const VoteButton = ({id}) => {

    const toggleName = 'vote';


    const [ right , setRight ] = useState( '0px');
    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [zIndex , setZIndex ] = useState( -1 );
    const canDisplay = useSelector(canDisplayVoteFilter(id));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initOne({id : toggleName}));
    }, []);

    const display = useSelector(barreToggleFilter(toggleName));

    useEffect(() => {
        if(display) {
            setRight('200px');
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        }
        else{
            setRight('0px');
            setVisibility('hidden');
            setOpacity(0);
            setZIndex(-1 );

        }
    }, [display])
    const toggle = (evt) => {
        evt.stopPropagation();console.log(1);
        dispatch(toggleBarre({id : toggleName}));
    }

    const forceReload = () => {
        dispatch(reloadDocument({id}));
    }

    return (
        <>
            { canDisplay ?
                <>
                    <div className="barre-elem">
                        <img className="logo " src={vote} alt="Vote" onClick={toggle}/>
                        <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content">
                            <Vote id={id} forceReload={forceReload}></Vote>
                        </div>
                    </div>
                </>
                : <></>
            }
        </>
    )
}
export default VoteButton;
