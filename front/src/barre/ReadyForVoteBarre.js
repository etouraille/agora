import React , {useState } from 'react';
import diff from "../svg/diff.svg";
import ok from '../svg/positive-vote.svg'
import {useParams} from "react-router";
import ReadyForVote from "../vote/ReadyForVote";

const ReadyForVoteBarre = () => {

    const [ visibility , setVisibility ] = useState( 'hidden');
    const [ opacity , setOpacity ] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );
    const canDisplay = true;

    const { id } = useParams();

    const toggle = () => {

        if( visibility === 'hidden') {
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        } else {
            setVisibility('hidden');
            setOpacity(0);
            setZIndex(-1 );

        }

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