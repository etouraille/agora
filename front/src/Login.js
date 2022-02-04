import React from 'react'
import http from './http/http';
import history from "./utils/history";
import { useDispatch } from "react-redux";
import { login , logout } from './redux/slice/loginSlice';
import { Formik, Form , Field, ErrorMessage }  from "formik";
import { GoogleLogin } from 'react-google-login';
/*global FB*/

const Login = () => {

    const dispatch = useDispatch();

    const responseGoogle = (data) => {
        http.post('/sign-in-google', data).then( data => {
            successLogin(data);
        })
    }

    const successLogin = (data) => {
        if( data.data.token ) {
            localStorage.setItem( 'token', data.data.token );
            if(localStorage.getItem('redirect') && localStorage.getItem('redirect') !== 'null') {
                history.push(localStorage.getItem('redirect'));
                localStorage.setItem('redirect', null);
            } else {
                history.push("/documents");
            }
            dispatch(login({token : data.data.token , userId : data.data.userId}));
        } else {
            dispatch(logout());
        }
    }

    const onFacebookClick = (evt) => {
        FB.login((data) => {

            let tokenId = data?.authResponse?.accessToken;
            if (tokenId) {
                http.post('/sign-in-facebook',{tokenId}).then(data => {
                    successLogin(data);
                })
            }

        }, {scope: 'email'});
    }

    return (
    <div>
        <Formik
            initialValues={{email : '', password :''}}
            validate={values => {
                const errors = {};
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onReset={values => {}}
            onSubmit={(values , { setSubmitting , resetForm }) => {
                let mounted = true;
                http.post('/signin', { username : values.email, password : values.password })
                    .then( data => {
                        successLogin(data);
                        setSubmitting(false);
                    }).catch(error => console.log( error ));

                    resetForm({ values : ''});

            }}>
            {({ isSubmitting, handleSubmit }) => (
                <Form>
                    <div className="input-group flex-nowrap">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="addon-wrapping">@</span>
                        </div>
                        <Field type="email" name="email" className="form-control"></Field>
                        <ErrorMessage name="email" component="div"></ErrorMessage>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <Field type="password" name="password" className="form-control"></Field>
                        <ErrorMessage name="password" component="div"></ErrorMessage>
                    </div>
                    <button className="btn btn-primary" type="submit" onClick={handleSubmit} disabled={isSubmitting} >
                        Submit
                    </button>
                </Form>
            )}

        </Formik>
        <GoogleLogin
            clientId={process.env.REACT_APP_google_key}
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        />
        <button className="btn btn-success" onClick={onFacebookClick}>Login Facebook</button>
    </div>

    );
}
export default Login;
