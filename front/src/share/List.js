import React from "react";
import {Formik, Form, Field, FieldArray, ErrorMessage} from "formik";
import http from "../http/http";

const List = ({id}) => (
    <>
    <div>
        <Formik
            initialValues={{ friends: [] }}
            validate={values => {
                const errors = {};
                console.log( errors);
                values.friends.forEach((email,index) => {
                  if(!email) {
                      errors['emails.' + index ] = 'Required';
                  } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
                  ) {
                      errors['emails.' + index ] = 'Invalid email address';
                  }
                })
                console.log(errors);
                return errors;
            }}
            onReset={() =>{}}
            onSubmit={(values , { setSubmitting , resetForm })=> {
                console.log('submit ====');
                http.post('/api/invite-to-contribute', {emails: values.friends, id})
                    .then(data => {
                        // todo erase email and close window
                        setSubmitting(false);
                    }).catch(error => console.log(error));

                resetForm({values: {friends: []}});
            }}>
            {({ values, isSubmitting, handleSubmit}) => (
                <Form>
                    <FieldArray
                        name="friends"
                        render={(arrayHelpers) => (
                            <div>
                                {values.friends && values.friends.length > 0 ? (
                                    values.friends.map((friend, index) => (
                                        <div key={index}>
                                            <Field name={`friends.${index}`} onClick={evt => evt.stopPropagation()}/>
                                            <ErrorMessage name={`emails.${index}`} component="div"></ErrorMessage>
                                            <button
                                                type="button"
                                                onClick={(evt) => {evt.stopPropagation();arrayHelpers.remove(index)}} // remove a friend from the list
                                            >
                                                -
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(evt) => {evt.stopPropagation();arrayHelpers.insert(index, "")}} // insert an empty string at a position
                                            >
                                                +
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <button type="button" onClick={(evt) => {evt.stopPropagation();arrayHelpers.push("")}}>
                                        {/* show this when user has removed all friends from the list */}
                                        Add a friend
                                    </button>
                                )}

                            </div>
                        )}
                    />
                    <div>
                        <button type="button" onClick={(evt) => {evt.stopPropagation();handleSubmit()}}>Submit</button>
                    </div>
                </Form>
            )}
        </Formik>
    </div>
    </>
);

export default List;
