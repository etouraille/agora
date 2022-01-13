import React , {useState} from 'react';
import floppy from "../svg/floppy.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { forSave } from "../redux/slice/documentChangeSlice";

const SaveDocument = () => {

    const {id } = useParams();

    const dispatch = useDispatch();

    const toggleName = 'save';

    const canDisplay = useSelector(state => {
        let elem = state.documentChange.find(elem => elem.id === id);
        if (elem) {
            return elem.changed;
        } else {
            return false;
        }
    })

    const save = (evt) => {
        evt.stopPropagation();console.log(1);
        dispatch( forSave({id}));
    }


    return (
        <>
            { canDisplay ?
                <div>
                    <div className="barre-elem">
                        <img className="logo " src={floppy} alt="Vote" onClick={save}/>
                    </div>
                </div>
                : <></>
            }
        </>
    )
}
export default SaveDocument;
