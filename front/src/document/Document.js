import React, { useState , useEffect } from 'react';
import { Formik, Form , ErrorMessage, Field } from 'formik'
import http from "../http/http";
import Quill from 'quill';


const Document = () => {

    const [body , setBody ] = useState([]);

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
        <Formik
            initialValues={{ title : ''}}
            onSubmit={( values , {setSubmitting}) => {
                values['body'] = JSON.stringify(body);
                http.post('/api/document', values).then((data) => {
                    console.log(data);
                    setSubmitting(false);
                }, error => {
                    console.log(error);
                    setSubmitting(false);
                })
            }}
            validate={ (values  )=> {
                let errors = {};
                console.log( body );
                if( body.length === 0 ) {
                    errors.body = 'Le corps ne peut être vide';
                }

                if( ! values.title ) {
                    errors.title = 'Le titre est obligatoire';
                }
                console.log( errors );
                return errors;
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div className="input-group flex-nowrap">
                        <Field type="text" name="title" className="form-control"></Field>
                        <ErrorMessage name="title" component="div"></ErrorMessage>
                    </div>
                    <div className="form-group">
                        <ErrorMessage name="body" component="div"></ErrorMessage>
                        <div id="quill"></div>
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={isSubmitting} >
                        Submit
                    </button>
                </Form>
            )}
        </Formik>

    )
}

export default Document;