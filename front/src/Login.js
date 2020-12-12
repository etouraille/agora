import React from 'react'
import http from './http/http';
import history from "./utils/history";
import { useDispatch } from "react-redux";
import { login , logout } from './redux/slice/loginSlice';
import { Formik, Form , Field, ErrorMessage }  from "formik";

const Login = () => {

    const dispatch = useDispatch();

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
            onSubmit={(values , { setSubmitting }) => {
                http.post('/signin', { username : values.email, password : values.password })
                    .then( data => {
                        if( data.data.token ) {
                            localStorage.setItem( 'token', data.data.token );
                            console.log( 'history');
                            history.push("/home");
                            dispatch(login({token : data.data.token , user : data.data.user}));
                        } else {
                            dispatch(logout());
                        }
                        setSubmitting(false);
                    }).catch(error => console.log( error ));
            }}>
            {({ isSubmitting }) => (
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
                    <button className="btn btn-primary" type="submit" disabled={isSubmitting} >
                        Submit
                    </button>
                </Form>
            )}

        </Formik>
    </div>
    );
}
export default Login;