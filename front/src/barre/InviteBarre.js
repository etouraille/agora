import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import canDisplayVoteFilter from "../redux/filter/canDisplayFoteFilter";
import invite from "../svg/invite.svg";
import Vote from "../vote/Vote";
import Invite from "../invite/Invite";
import {useParams} from "react-router";

const InviteBarre = () => {
    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );

    const { id } = useParams();
    const canDisplay = true;



    const dispatch = useDispatch();

    const toggle = () => {
        if(visibility === 'hidden') {
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        }
        else{
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