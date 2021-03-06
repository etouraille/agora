import React, {useCallback, useState} from 'react';
import {Modal} from "react-bootstrap";
import Quill from "quill";
import http from "../../http/http";
import {useDispatch, useSelector} from "react-redux";
import { sub } from "../../redux/slice/subscribedSlice";
import {add } from "./../../redux/slice/amendSlice";
import QFactory from "../../quill/QFactory";
import junction from './../../svg/junction.svg';

const AmendButton = ({id , document, reload , onClick }) => {

    const [ modalIsOpen, setModalIsOpen ] = useState( false );
    const [ before , setBefore ] = useState([]);
    const [ after , setAfter ] = useState([]);
    const [ current, setCurrent ] = useState( []);
    const [ range , setRange ] = useState( null );

    const user = useSelector( state => state.login.user );

    const isInRange = (needle , haystack ) => {
        if(needle.index < haystack.index ) {
            return (needle.index + needle.length) > haystack.index;
        } else if( needle.index >= haystack.index ) {
            return needle.index < ( haystack.index + haystack.length );
        }
    }

    const amend = useCallback((evt ) => {
        if( typeof onClick === 'function') {
            onClick();
        }

        const param = { readOnly : true, toolbar : '#toolbar' };
        let editor = QFactory.get('#editor', param );



            evt.preventDefault();
            const somerange = editor.getSelection();

            let inRange = false;
            if( document.children.length > 0 && somerange ) {
                document.children.forEach( object => {
                    if( isInRange(somerange, object.link )) {
                        inRange = true;
                    }
                })
            }


            if (somerange && !inRange ) {
                setRange( somerange );
                setBefore(editor.getContents( 0, somerange.index));
                setCurrent(editor.getContents(somerange.index, somerange.length));
                setAfter( editor.getContents(somerange.index + somerange.length , editor.getLength()));
                setModalIsOpen(true);
            } else if( somerange && inRange ) {

            }



    }, [ document ])

    const onEnteredModal = () => {
        const quillBefore = new Quill('#before', {readOnly : true});
        quillBefore.setContents(before);
        const quill = new Quill('#current', {readOnly : true});
        quill.setContents(current);
        const quillAfter = new Quill('#after', {readOnly : true});
        quillAfter.setContents(after);
    }

    const dispatch = useDispatch();

    const confirmAmend = ( evt ) => {
        setModalIsOpen(false);
        http.post('/api/amend', {
            id : id ,
            selection : current,
            index : range.index ,
            length : range.length
        }).then(
            data => {
                dispatch(sub({id : data.data.id , user: user }));
                dispatch(add({ id: id , child : data.data.id }));
                reload();
                //history.push('/document/' + data.data.id );
            },
            error => {
                console.log( error );
            }
        )
    }


    return (
        <>
            <img className="logo" src={junction} onClick={amend}></img>
            <Modal
                show={modalIsOpen}
                onHide={() => setModalIsOpen(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                onEntered={onEnteredModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Ammendement du text
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="before"></div>
                    <div id="current"></div>
                    <div id="after"></div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={confirmAmend}>Amender</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default AmendButton;