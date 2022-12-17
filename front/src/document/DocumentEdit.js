import React , { useEffect , useState , useCallback } from 'react';

import { useParams } from "react-router";

import Quill from 'quill';
import 'quill/dist/quill.bubble.css';
import Sharedb from 'sharedb/lib/client';
import richText from 'rich-text';
import http from "../http/http";

import {initDocumentChange , changed , afterSave} from "../redux/slice/documentChangeSlice";
import {useDispatch, useSelector} from "react-redux";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import history from "../utils/history";
import useLoadDocument from "../utils/useLoadDocument";
import canEditDocument from "../redux/filter/canEditDocument";
import QFactory from "../quill/QFactory";
import {firstChar, lastChar} from "../utils/truncateEditor";

Sharedb.types.register(richText.type);



// Connecting to our socket server

// Querying for our document


const DocumentEdit = () => {

    const socket = new WebSocket(process.env.REACT_APP_ws);
    const connection = new Sharedb.Connection(socket);


    const { id } = useParams();
    const [ editor, setEditor] = useState( null );
    const [ focusChanged , setFocusChanged ] = useState( false );
    const options = {
        theme: 'snow',
    };
    let previousFocus = false;

    const dispatch = useDispatch();

    const user = useSelector(state => state.login.userId );

    const _canEditDocument = useSelector(canEditDocument(id))

    const rfv = useSelector( readyForVoteSubscribedFilter(id));

    const mouseMouve = useCallback(( evt ) => {
        const focus  = editor.hasFocus();
        if( focus === previousFocus ) {
            setFocusChanged(false );
        } else {
            setFocusChanged( true  );
        }
        previousFocus = focus;
    }, [editor , previousFocus]);

    const forSave = useSelector(state => {
        let elem = state.documentChange.find(elem => elem.id === id );
        if( elem ) {
            return elem.forSave;
        } else {
            return false;
        }
    })

    useEffect(() => {
        if( rfv.isReadyForVote ) {
            history.push('/document/' + id );
        }
    }, [id , rfv ]);

    useEffect(() => {
        if( forSave && connection ) {
            socket.onopen = () => {
                connection.send({a: 'hs', id: 'save-' + id + '---' + user });
                dispatch(afterSave({id}));
            }
        }
    }, [forSave , connection , id , socket])

    useEffect(() => {
        if( focusChanged && connection ) {
            socket.onopen = () => {
                connection.send({a: 'hs', id: 'save-' + id + '---' + user });
                dispatch(afterSave({id}));
            }
        }
    }, [focusChanged , connection, id , socket ])


    useEffect(() => {
        if(editor) {
            window.addEventListener('mousemove', mouseMouve)
        }
        return () => {
            window.removeEventListener('mousemove', mouseMouve );
        }
    }, [ editor ]);

    useEffect(() => {
        if (editor) {
            setQuillDiv(editor, !_canEditDocument);
        }
    }, [_canEditDocument, editor]);


    const setQuillDiv = (quill, readOnly) => {
        if( ! quill ) {
            options['readOnly'] = readOnly;
            quill = QFactory.get('#editor', options);
            setEditor(quill);
        } else {
            readOnly ? quill.disable() : quill.enable();
        }
        return quill;
    }

    useEffect(() => {

        if (_canEditDocument) {
            setQuillDiv(editor, false);
        } else {
            setQuillDiv(editor, true);
        }

        socket.onopen = () => {

            connection.send({a: 'hs', id: id });

            const doc = connection.get('documents', id );

            console.log(doc);

            dispatch( initDocumentChange({id}));

            doc.subscribe( (err) => {
                if (err) throw err;

                quill = setQuillDiv(quill, !_canEditDocument);

                /**
                 * On Initialising if data is present in server
                 * Updaing its content to editor
                 */
                if( doc.data ) {
                    quill.setContents(doc.data.ops);
                }
                doc.on('create', function( delta) {
                    quill.setContents(doc.data.ops);
                })
                /**
                 * On Text change publishing to our server
                 * so that it can be broadcasted to all other clients
                 */
                quill.on('text-change', function (delta, oldDelta, source) {
                    if (source !== 'user') return;
                    doc.submitOp(delta, {source: quill});
                    dispatch(changed({id}));
                });

                /** listening to changes in the document
                 * that is coming from our server
                 */
                doc.on('op', function (op, source) {
                    if (source === quill) return;
                    quill.updateContents(op);
                    dispatch( changed( {id }));
                });

            })

            let quill;


        }
        return () => {
            connection.close();
        };
    }, [id ]);

    const { document } = useLoadDocument({id, reload: true});

    useEffect(() => {
            const quill = new Quill('#hiddenEditor');
            if( document.parent && document.parent.document  ) {
                quill.setContents(JSON.parse(document.parent.document.body));
                const before = quill.getContents(0, document.parent.link.index);
                const after = quill.getContents(document.parent.link.index + document.parent.link.length, quill.getLength());

                const beforequill = new Quill("#before", {readonly: true});
                beforequill.setContents(before);
                lastChar(beforequill, 1500);

                const afterquill = new Quill("#after", {readonly: true});
                afterquill.setContents(after);
                firstChar(afterquill, 1500);
            }

    }, [id, document ])



    return (
        <div>
            <div id="hiddenEditor" style={{ display : 'none'}}></div>
            <div id="before"></div>
            <div className="row">
                <div className="form-group col-sm-12">
                    <div id="editor"></div>
                </div>
            </div>
            <div id="after" className="after-editor"></div>
        </div>
    )
}

export default DocumentEdit;
