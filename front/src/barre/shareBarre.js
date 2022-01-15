import React, {useEffect, useState} from 'react';
import share from "../svg/share.svg";
import {useDispatch, useSelector} from "react-redux";
import canDisplayVoteFilter from "../redux/filter/canDisplayVoteFilter";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import Share from "../share/Share";
import isDocumentRootFilter from "../redux/filter/isDocumentRootFilter";
import ModalBarre from "./ModalBarre";

const ShareBarre = ({id}) => {


    const [ open, setOpen] = useState(false);

    const canDisplay = useSelector(isDocumentRootFilter(id));

    const toggle = (evt) => {
        evt.stopPropagation();console.log(1);
        setOpen(!open);
    }

    return (
        <>
            { canDisplay ?
                <>
                    <div className="barre-elem">
                        <img className="logo " src={share} alt="Share" onClick={toggle}/>
                        <div>
                            <ModalBarre title={`Share`} content={() => <Share id={id}></Share>} open={open} setOpen={setOpen}></ModalBarre>
                        </div>
                    </div>
                </>
                : <></>
            }
        </>
    )
}
export default ShareBarre;
