import React, {useState} from 'react';
import folder from "../svg/folder.svg";
import Invite from "../invite/Invite";
import DocumentList from "../document/List";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";

const Documents = () => {

    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );

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

    const canDisplay = true;

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <img onClick={toggle} className="logo " src={folder} alt="Amend"/>
                <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content left-content-invite">
                    <DocumentList></DocumentList>
                </div>
            </div> : <></> }
        </>
    )
}
export default Documents;