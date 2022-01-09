import React, {useEffect, useState} from 'react';
import share from "../svg/share.svg";
import {useDispatch, useSelector} from "react-redux";
import canDisplayVoteFilter from "../redux/filter/canDisplayVoteFilter";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import Share from "../share/Share";
import isDocumentRootFilter from "../redux/filter/isDocumentRootFilter";

const ShareBarre = ({id}) => {

    const toggleName = 'share';


    const [ right , setRight ] = useState( '0px');
    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [zIndex , setZIndex ] = useState( -1 );
    const canDisplay = useSelector(isDocumentRootFilter(id));

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
    const toggle = () => {
        dispatch(toggleBarre({id : toggleName}));
    }

    return (
        <>
            { canDisplay ?
                <>
                    <div className="barre-elem">
                        <img className="logo " src={share} alt="Share" onClick={toggle}/>
                        <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content">
                            <Share id={id}></Share>
                        </div>
                    </div>
                </>
                : <></>
            }
        </>
    )
}
export default ShareBarre;
