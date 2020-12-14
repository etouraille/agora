import React , { useEffect , useState , useCallback } from 'react';

import { useParams } from "react-router";

import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import http from "../http/http";
import Invite from "../invite/Invite";
import ReadyForVote from "../vote/ReadyForVote";
Sharedb.types.register(richText.type);

// Connecting to our socket server

// Querying for our document


const DocumentEdit = () => {

    const socket = new WebSocket('ws://127.0.0.1:8080');
    const connection = new Sharedb.Connection(socket);
    const { id } = useParams();
    const [ editor, setEditor] = useState( null );
    const [ focusChanged , setFocusChanged ] = useState( false );
    const [ showInvite , setShowInvite ] = useState( false );
    const options = {
        theme: 'snow',
    };
    let previousFocus = false;

    const mouseMouve = useCallback(( evt ) => {
        const focus  = editor.hasFocus();
        if( focus === previousFocus ) {
            setFocusChanged(false );
        } else {
            setFocusChanged( true  );
        }
        previousFocus = focus;
    }, [editor , previousFocus]);

    useEffect(() => {
        console.log( connection );
        if( focusChanged && connection ) {
            socket.onopen = () => {
                connection.send({a: 'hs', id: 'save-' + id});
            }
        }
    }, [focusChanged , connection, id , socket])


    useEffect(() => {
        if(editor) {
            window.addEventListener('mousemove', mouseMouve)
        }
        return () => {
            window.removeEventListener('mousemove', mouseMouve );
        }
    }, [ editor ]);


    useEffect(() => {

        socket.onopen = () => {

            connection.send({a: 'hs', id: id });

            const doc = connection.get('documents', id );

            let quill;

            const subscribeDoc = function (err) {
                if (err) throw err;


                if( ! quill ) {
                    quill = new Quill('#editor', options);
                    setEditor(quill);
                }
                /**
                 * On Initialising if data is present in server
                 * Updaing its content to editor
                 */
                if( doc.data ) {
                    quill.setContents(doc.data.ops);
                } else {
                    doc.on('create', () => {
                        console.log( 'created');
                        doc.subscribe( subscribeDoc );
                    })
                }
                /**
                 * On Text change publishing to our server
                 * so that it can be broadcasted to all other clients
                 */
                quill.on('text-change', function (delta, oldDelta, source) {
                    if (source !== 'user') return;
                    doc.submitOp(delta, {source: quill});
                });

                /** listening to changes in the document
                 * that is coming from our server
                 */
                doc.on('op', function (op, source) {
                    if (source === quill) return;
                    quill.updateContents(op);
                });
            }

            /*
            */

            doc.subscribe(subscribeDoc);
        }
        return () => {
            connection.close();
        };
    }, [id ]);

    useEffect(() => {
        http.get('/api/document/' + id ).then(data => {
            const quill = new Quill('#hiddenEditor');
            if( data.data.parent ) {
                quill.setContents(JSON.parse(data.data.parent.body));
                const before = quill.getContents(0, data.data.parentLink.index);
                const after = quill.getContents(data.data.parentLink.index + data.data.parentLink.length, quill.getLength());

                const beforequill = new Quill("#before", {readonly: true});
                beforequill.setContents(before);

                const afterquill = new Quill("#after", {readonly: true});
                afterquill.setContents(after);
            }

        })
    }, [id])

    return (
        <div>
            <div id="hiddenEditor" style={{ display : 'none'}}></div>
            <div id="before"></div>
            <div className="row">
                <div className="form-group col-sm-10">
                    <div id="editor"></div>
                </div>
                <div className="col-sm">
                    <ReadyForVote id={id}></ReadyForVote>
                </div>
            </div>
            <div id="after"></div>
            <div>
                <div style={{ display : showInvite ? 'block' : 'none' }} >
                    <Invite  id={id}></Invite>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowInvite(!showInvite)}}>Invite</button>
            </div>
        </div>
    )
}

export default DocumentEdit;