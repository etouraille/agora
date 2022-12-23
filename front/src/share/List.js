import React, {useState} from "react";
import {Formik, Form, Field, FieldArray, ErrorMessage} from "formik";
import http from "../http/http";
import inviteSvg from "../svg/invite.svg";
import SearchApi from "../search/SearchApi";
import Search from "../utils/search";

const List = ({id}) => {

    const [ users, setUsers ] = useState([]);

    const changeUser = (data, index) => {
        let _users = users;
        _users[index] = data;
        setUsers(_users);
    }

    const removeUser = (evt, helper, index ) => {
        evt.stopPropagation();
        helper.remove(index);
        users.splice(index, 1);
        setUsers(users);
    }

    return (
    <>
    <div>
        <Formik
            initialValues={{ friends: [] }}
            validate={values => {
                const errors = {};
                console.log( errors);
                users.forEach((user,index) => {
                  if(!user) {
                      errors['emails.' + index ] = 'Required';
                  } else if (user.isUser === false &&
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.value)
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
                http.post('/api/invite-to-contribute', {users, id})
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
                                            <Search id={`friends.${index}`} onChange={(data) => changeUser(data, index)}></Search>

                                            <ErrorMessage name={`emails.${index}`} component="div"></ErrorMessage>
                                            <button
                                                type="button"
                                                onClick={(evt) => {removeUser(evt, arrayHelpers, index)}} // remove a friend from the list
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
)};

export default List;
