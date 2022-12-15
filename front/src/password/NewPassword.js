import React, {useState} from 'react';
import Email from '../validation/Mail';
import history from "../utils/history";
import {login} from "../redux/slice/loginSlice";
import {useDispatch} from "react-redux";
import http  from './../http/http';
import useQuery from "../utils/query";
const NewPassword = () => {

    let [ password, setPassword] = useState(null);


    const changePassword = ( evt ) => {
        setPassword(evt.target.value)
    }

    let query = useQuery();
    let token = query.get('token');

    const submit = () => {

        http.post('new-password', {password, token}).then(() => {
            history.push('/');
        }, error => {

        })
    }




    return (
        <form>
            <div className="form-group">
                <label htmlFor="name">Password</label>
                <input type="text" className="form-control" id="name" onChange={evt => changePassword( evt )} />
            </div>

            <div className="form-group">
                <button className="btn btn-primary" onClick={(event) => submit(event)}>Envoyer</button>
            </div>

        </form>
    )

}
export default NewPassword;
