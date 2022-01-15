import React, {useState} from 'react';
import Email from '../validation/Mail';
import history from "../utils/history";
import {login} from "../redux/slice/loginSlice";
import {useDispatch} from "react-redux";

const SubscribeForm = () => {

    const dispatch = useDispatch();

    let [email, setEmail] = useState(null);
    let [pwd, setPwd] = useState( null);
    let [pwd2, setPwd2] = useState(null);
    let [ error, setError ] = useState( false);
    let [ userExists , setUserExists] = useState( false);
    let [ isEmailValid, setIsEmailValid ] = useState( false );

    const changeEmail = ( evt ) => {
        setEmail(evt.target.value)
    }

    const changePassword = ( evt ) => {
        let error = false;
        if(pwd2 && evt.target.value !== pwd2 ) {
            error = true;
        }
        setPwd(evt.target.value);
        setError(error);
    }

    const changePassword2 = ( evt ) => {
        if (pwd && pwd !== evt.target.value ) {
            setError(true);
        } else {
            setError(false);
        }
        setPwd2(evt.target.value)
    }

    const submit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email , password : pwd })
        };
        fetch(process.env.REACT_APP_api + 'subscribe', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.reason ) {
                    setUserExists(true);
                } else if( data.token ) {
                    dispatch(login({token : data.token , user : data.email}));
                    localStorage.setItem('token', data.token);
                    if (localStorage.getItem('redirect') && localStorage.getItem('redirect') !== 'null') {
                        history.push(localStorage.getItem('redirect'));
                        localStorage.setItem('redirect', null);
                    } else {
                        history.push('/documents');
                    }
                }
            });
    }



    let span = error ? <span style={{ color : 'red' }}>*</span> : <span></span>;
    let exists = userExists ? <span style={{ color : 'red'}}>Cette utilisateur existe déjà</span>: <span></span>;
    let button = (! error && isEmailValid ) ?
        <button type="button" className="btn btn-primary" onClick={() => submit()}>Sauvegarder</button> : <button type="button" className="btn btn-primary" disabled>Sauvegarder</button>
    return (
        <form>
            { exists }
            <div className="input-group flex-nowrap">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">@</span>
                </div>
                <Email change={evt => changeEmail(evt)} valid={ valid => setIsEmailValid(valid)}></Email>
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" className="form-control" id="password" onChange={evt => changePassword( evt )} />
            </div>
            <div className="form-group">
                <label htmlFor="password2">Confirmer le mot de passe {span}</label>
                <input type="password" className="form-control" id="password2" onChange={ evt => changePassword2( evt )} />
            </div>
            { button }

        </form>
    )

}
export default SubscribeForm;
