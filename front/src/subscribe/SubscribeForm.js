import React, {useState} from 'react';
import Email from '../validation/Mail';
import history from "../utils/history";
import {login} from "../redux/slice/loginSlice";
import {useDispatch} from "react-redux";
import {sub} from "../redux/slice/subscribedSlice";
import {subscribeDoc} from "../redux/slice/documentSubscribeSlice";
import {reload} from "../redux/slice/reloadDocumentSlice";
import {reloadList} from "../redux/slice/reloadDocumentListSlice";
import http from "../http/http";
const SubscribeForm = () => {

    const dispatch = useDispatch();

    let [ email, setEmail] = useState(null);
    let [ name, setName ] = useState(null);
    let [ pwd, setPwd] = useState( null);
    let [ pwd2, setPwd2] = useState(null);
    let [ error, setError ] = useState( false);
    let [ userExists , setUserExists] = useState( false);
    let [ isEmailValid, setIsEmailValid ] = useState( false );

    const changeEmail = ( evt ) => {
        setEmail(evt.target.value)
    }

    const changeName = (evt) => {
        setName(evt.target.value);
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
        http.post('subscribe', { email: email , password : pwd , name}).then(data => {
            if(data.data.reason ) {
                setUserExists(true);
            } else if( data.data.token ) {
                dispatch(login({token : data.data.token, email: data.data.email, userId: data.data.userId }));
                if(data.data.documentId) {
                    let id = data.data.documentId;
                    let ids = data.data.ids;
                    let user = data.data.userId;
                    dispatch( sub({ id : id }))
                    ids.forEach( childrenId  => {
                        dispatch( sub({ id : childrenId }))

                    })
                    // subscribe associé au document.
                    dispatch( subscribeDoc({id , user }))
                    dispatch(reload({id}));
                    dispatch( reloadList());
                }
                localStorage.setItem('token', data.data.token);
                if (localStorage.getItem('redirect') && localStorage.getItem('redirect') !== 'null') {
                    history.push(localStorage.getItem('redirect'));
                    localStorage.setItem('redirect', null);
                } else {
                    history.push('/documents');
                }
            }
        })

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
                <label htmlFor="name">Nom</label>
                <input type="text" className="form-control" id="name" onChange={evt => changeName( evt )} />
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
