import React, {useCallback, useEffect, useState } from 'react';
import link from './../svg/link.svg';
import mail from './../svg/mail.svg'
import http from "../http/http";
import history from "../utils/history";
import {login, logout} from "../redux/slice/loginSlice";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import List from "./List";
const Share = ({ id }) => {

    const [isEmail, setIsEmail] = useState(false);

    const toggleEmail = (evt) => {
        evt.stopPropagation();console.log(1);
        setIsEmail(!isEmail);
    }

    const copyToClipboard = ( value ) => {
        if (!navigator.clipboard){
            _copyToClipboard(value);
        } else {
            navigator.clipboard.writeText(value);
        }
    }

    const saveLink = (evt) => {
        evt.stopPropagation();console.log(1);
        const link = process.env.REACT_APP_front + '/document/' + id;
        copyToClipboard(link);
        // todo close window.
    }

    function _copyToClipboard(val){
        const dummy = document.createElement("input");
        dummy.style.display = 'none';
        document.body.appendChild(dummy);

        dummy.setAttribute("id", "dummy_id");
        document.getElementById("dummy_id").value=val;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

    return(
        <div>
            <div className="box">
                <div><img src={mail} alt="email" className="logo" onClick={toggleEmail}/></div>
                <div><img src={link} alt="link" className="logo" onClick={saveLink}/></div>
            </div>
            { isEmail ? <List id={id}></List> : <></>}
        </div>
    )
}
export default Share;
