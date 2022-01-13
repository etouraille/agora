import React, {useEffect, useState} from 'react';
import folder from "../svg/folder.svg";
import Invite from "../invite/Invite";
import DocumentList from "../document/List";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
const Documents = () => {

    const toggleName = 'document';

    const [ visibility, setVisibility ] = useState( 'hidden');
    const [ opacity, setOpacity] = useState( 0);
    const [ zIndex , setZIndex ] = useState( -1 );

    const dispatch = useDispatch();

    const display = useSelector(barreToggleFilter(toggleName));

    useEffect(() => {
        dispatch(initOne({id : toggleName }));
    }, [

    ])

    useEffect(() => {
        if( display ) {
            setVisibility('visible');
            setOpacity(1);
            setZIndex(1000);
        } else {
            setVisibility('hidden');
            setOpacity(0);
            setZIndex(-1 );

        }

    }, [ display ]);

    const toggle = (evt) => {
        let dev_null =  evt ? evt.stopPropagation() : null;
        dispatch( toggleBarre({id : toggleName}));
    }

    const canDisplay = true;

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <img onClick={toggle} className="logo " src={folder} alt="Amend"/>
                <div style={{ visibility, opacity  , zIndex : zIndex }} className="left-content left-content-invite">
                    <DocumentList onClick={toggle}></DocumentList>
                </div>
            </div> : <></> }
        </>
    )
}
export default Documents;
