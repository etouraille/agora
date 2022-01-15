import React, {useEffect} from 'react';
import diff from "../svg/diff.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { reload as setReload  } from "../redux/slice/reloadDocumentSlice";
import canDisplayAmendFilter from "../redux/filter/canDisplayAmendFilter";
import AmendButton from "../document/amend/AmendButton";
import documentFilter from "../redux/filter/documentFilter";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import ModalBarre from "./ModalBarre";


const AmendButtonBarre = () => {

    const toggleName = 'amend';

    const { id } = useParams();

    const canDisplay = useSelector(canDisplayAmendFilter(id));
    const document = useSelector(documentFilter(id));

    console.log( canDisplay );

    const dispatch = useDispatch();



    useEffect(() => {
        dispatch( initOne( { id : toggleName }));
    }, [])

    const reload = () => {
        dispatch(setReload({ id : id }));
    }

    const click = (evt) => {
        evt.stopPropagation();console.log(1);
        dispatch( toggleBarre({id : toggleName}));
    }

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <div>
                    <AmendButton id={id} document={document} reload={reload} onClick={(evt) => click(evt)}></AmendButton>
                </div>
            </div> : <></> }
        </>
    )
}
export default AmendButtonBarre;
