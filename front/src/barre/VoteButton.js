import React , {useState} from 'react';
import vote from "../svg/vote.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { toggleDiff } from "../redux/slice/toggleDiffSlice";
import canDisplayVoteFilter from "../redux/filter/canDisplayFoteFilter";
import Vote from "../vote/Vote";

const VoteButton = ({id}) => {



    const [ right , setRight ] = useState( '0px');
    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [zIndex , setZIndex ] = useState( -1 );
    const canDisplay = useSelector(canDisplayVoteFilter(id));

    const dispatch = useDispatch();

    const toggle = () => {
        if(right === '0px') {
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
    }

    return (
        <>
            { canDisplay ?
                <div>
                    <div className="barre-elem">
                        <img className="logo " src={vote} alt="Vote" onClick={toggle}/>
                    </div>
                    <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content">
                        <Vote id={id}></Vote>
                    </div>
                </div>
                : <></>
            }
        </>
    )
}
export default VoteButton;