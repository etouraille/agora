import React, {useState, useEffect, useCallback} from 'react';
import { Formik, Form , ErrorMessage, Field } from 'formik'
import http from "../http/http";
import Quill from 'quill';
import history from "../utils/history";
import { sub } from "../redux/slice/subscribedSlice";
import {useDispatch} from "react-redux";
import {reloadList} from "../redux/slice/reloadDocumentListSlice";
import {FormCheck, FormGroup} from "react-bootstrap";

const Document = () => {



    const [body , setBody ] = useState([]);
    const [ checked, setChecked ] = useState(false);
    const dispatch = useDispatch();

    const handleChange = (value) =>  {
        setTimeout(() => {
            setChecked(!checked);
        })
    };

    useEffect(() => {
        const quill = new Quill('#quill', {
            theme : 'snow',
        });

        const handler = () => {
            setBody( quill.editor.delta.ops );
        };

        quill.on('text-change', handler );

        return () => {
            quill.off( 'text-change', handler );
        }
    }, [])

    return (
        <>
        <Formik
            initialValues={{ title : '', private: false}}
            onSubmit={( values , {setSubmitting}) => {
                values['body'] = JSON.stringify(body);
                values['private'] = checked;
                http.post('/api/document', values).then((data) => {
                    history.push('/documentedit/' + data.data.id);
                    dispatch(sub({id : data.data.id }));
                    //TODO : new subscription to mercure
                    dispatch(reloadList());
                    setSubmitting(false);
                }, error => {
                    console.log(error);
                    setSubmitting(false);
                })


            }}
            validate={ (values  )=> {
                let errors = {};
                if( body.length === 0 ) {
                    errors.body = 'Le corps ne peut être vide';
                }

                if( ! values.title ) {
                    errors.title = 'Le titre est obligatoire';
                }
                return errors;
            }}
        >
            {({ isSubmitting,values, handleSubmit, setFieldValue, errors }) => (
                <form>

                    <div className="input-group flex-nowrap">
                        <Field type="text" name="title" className="form-control" />
                        <ErrorMessage name="title" component="div" />
                    </div>
                    <div>
                        <label>Private</label>
                        <input type="checkbox" name="private" label="Private" checked={checked} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <ErrorMessage name="body" component="div" />
                        <div id="quill"></div>
                    </div>
                    <button className="btn btn-primary" type="submit" onClick={handleSubmit}  disabled={isSubmitting} >
                        Submit
                    </button>
                </form>
            )}
        </Formik>
        </>
    )
}

export default Document;
