import React, {useState} from 'react';
import Email from '../validation/Mail';
import history from "../utils/history";
import {login} from "../redux/slice/loginSlice";
import {useDispatch} from "react-redux";
import  http  from './../http/http';
const ResetPassword = () => {

    const dispatch = useDispatch();

    let [ email, setEmail] = useState(null);

    const changeEmail = ( evt ) => {
        setEmail(evt.target.value)
    }



    const submit = () => {

        http.post('reset-password', {email}).then(() => {
            history.push('/');
        }, error => {

        })
    }




    return (
        <form>
            <div className="form-group">
                <label htmlFor="name">Email</label>
                <input type="text" className="form-control" id="name" onChange={evt => changeEmail( evt )} />
            </div>

            <div className="form-group">
                <button className="btn btn-primary" onClick={(event) => submit(event)}>Envoyer</button>
            </div>

        </form>
    )

}
export default ResetPassword;
