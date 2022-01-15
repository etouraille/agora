import React, {useState, useEffect} from 'react';
import subscribe from "../svg/subscribe.svg";
import {useParams} from "react-router";
import Subscribe from "../document/subscribe/Subscribe";
import http from "../http/http";
import {useDispatch, useSelector} from "react-redux";
//import {initForOneDocument} from '../redux/slice/documentSubscribeSlice';
import { reload } from "../redux/slice/reloadDocumentSlice";
import {initOne , toggle as toggleBarre } from './../redux/slice/barreToggleSlice';
import barreToggleFilter from "../redux/filter/barreToggleFilter";
import ModalBarre from "./ModalBarre";

const SubscribeBarre = () => {

    const [ open, setOpen ] = useState(false);

    const { id } = useParams();

    const toggle = (evt) => {
        evt.stopPropagation();console.log(1);
        setOpen(!open)
    }



    return (
        <>
            <div className="barre-elem">
                <img onClick={toggle} className="logo " src={subscribe} alt="Amend"/>
                <div>
                    <ModalBarre title={`subscribe`} open={open} setOpen={setOpen} content={() => <Subscribe id={id}></Subscribe>}></ModalBarre>
                </div>
            </div>
        </>
    )
}
export default SubscribeBarre;
