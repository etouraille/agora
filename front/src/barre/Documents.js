import React, {useEffect, useState} from 'react';
import folder from "../svg/folder.svg";
import Invite from "../invite/Invite";
import DocumentList from "../document/List";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import ModalBarre from "./ModalBarre";
const Documents = () => {

    const [ open, setOpen] = useState(false);

    const toggle = (evt) => {
        evt.stopPropagation();
        setOpen( !open);
    }

    return (
        <>
            <div className="barre-elem">
                <img onClick={toggle} className="logo " src={folder} alt="Amend"/>
                <ModalBarre open={open} setOpen={setOpen} title={`Documents`} content={() => <DocumentList onClick={toggle}></DocumentList>}></ModalBarre>
            </div>
        </>
    )
}
export default Documents;
