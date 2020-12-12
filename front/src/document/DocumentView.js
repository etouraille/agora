import React , {useEffect, useState, useCallback } from 'react';
import http from "../http/http";
import history from "../utils/history";
import { useParams } from "react-router";
import ContextMenu from "../contextual/ContextMenu";
import TextSelector from 'text-selection-react';
import MenuSelectText from "../contextual/MenuSelectText";
import EditMenu from '../contextual/EditMenu';
import useSelection from "../contextual/useSelection";
import { Link } from 'react-router-dom';
import Delta  from 'quill-delta'
import Quill from 'quill';
import { Modal } from 'react-bootstrap';
import $ from 'jquery';
import EditMenuList from "../contextual/EditMenuList";
import {useSelector} from "react-redux";
import Vote from "../vote/Vote";
import AmendButton from "./amend/AmendButton";

const DocumentView = (props) => {
    const { id } = useParams();
    const [ document, setDocument ] = useState({document : { title : null, body : null}, children : []});
    const [ editor , setEditor ] = useState( null );
    const [ modalIsOpen , setModalIsOpen ] = useState( false );
    const [ before , setBefore ] = useState([]);
    const [ after , setAfter ] = useState([]);
    const [ current, setCurrent ] = useState( []);
    const [ range , setRange ] = useState( null );
    const [ showAmended , setShowAmended ] = useState( false );
    const [ reload , setReload ] = useState( false );
    const [ menus, setMenus ] = useState( []);
    const [ leftMenus , setLeftMenus ] = useState([]);

    let quill ;

    const isInRange = (needle , haystack ) => {
        if(needle.index < haystack.index ) {
            return (needle.index + needle.length) > haystack.index;
        } else if( needle.index >= haystack.index ) {
            return needle.index < ( haystack.index + haystack.length );
        }
    }

    const canAmendCauseEveryBodyReadyForVote = useSelector(state => {
        let can = false;
        state.readyForVote.forEach((elem, i ) => {
            if( elem.id === id ) {
                let count = 0;
                elem.data.forEach( (r,j ) => {
                    if( r.readyForVote === true  ) {
                        count ++;
                    }
                })
                if( count === elem.data.length ) {
                    can = true;
                }
            }
        })
        return can;
    })

    const amend = useCallback((evt ) => {
        if( editor ) {
            evt.preventDefault();
            const somerange = editor.getSelection();

            let inRange = false;
            if( document.children.length > 0 ) {
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

        }

    }, [editor, document ])

    const showAmend = useCallback((evt) => {
        setShowAmended(true);

    }, [ document , editor, showAmended ]);


    useEffect(() => {
        if( editor  && document.children.length > 0 && showAmended ) {

            const righteditor = new Quill('#rightEditor', {readOnly : true });
            const source = new Quill('#source');
            source.setContents(JSON.parse(document.document.body));

            const sortedChildren = document.children.sort((elem , elem2) => {
                return ((elem.link.index  < elem2.link.index) ? -1 : 1);
            })


            let content = source.getContents( 0 , sortedChildren[0].link.index );

            let leftMenusTemp = [];
            sortedChildren.forEach((elem, index ) => {
                const [ line, offset ] = editor.scroll.line( elem.link.index );
                leftMenusTemp.push({ node : line.domNode , id : elem.child.id });
            })
            setLeftMenus(leftMenusTemp);


            let deltaIndex = 0;

            sortedChildren.map( (object , i ) => {

                let current = JSON.parse( object.child.body );
                let afterIndex  = object.link.length + object.link.index;
                let afterLength = source.getLength() - ( object.link.index + object.link.length);
                if(sortedChildren[i+1]) {
                    afterLength = sortedChildren[i+1].link.index - ( object.link.index + object.link.length );
                }
                const delta = new Delta(current);
                let emptyQuill = new Quill('#emptyQuill');
                emptyQuill.setContents(delta);
                content = content.concat(delta);
                content = content.concat(source.getContents( afterIndex, afterLength))
                const yellow = [];
                const a = object.link.index + deltaIndex;
                const b = emptyQuill.getLength()-1;
                if(a) {
                    yellow.push({retain : a });
                }
                yellow.push({retain : b , attributes : { background : '#ffc107'}})

                const yellowBackground =  new Delta(yellow);
                deltaIndex = emptyQuill.getLength() - 1 - object.link.length;
                return yellowBackground;
            }).forEach((delta ) => {
                content = content.compose( delta );
            })
            //console.log( content );
            righteditor.setContents(content);

            let nodeAndId = [];
            deltaIndex = 0;
            sortedChildren.forEach(( object ) => {
                let current = JSON.parse( object.child.body );
                const delta = new Delta(current);
                let emptyQuill = new Quill('#emptyQuill');
                emptyQuill.setContents(delta);

                const [ line, index ]  = righteditor.scroll.line(object.link.index + deltaIndex );
                const node = line.domNode;
                console.log( object.link.index );
                nodeAndId.push( { node : node , id : object.child.id });
                deltaIndex = emptyQuill.getLength() - 1 - object.link.length;
            });
            setMenus( nodeAndId );
        }

    }, [showAmended, editor, document ]);

    const editAmend = useCallback((evt) => {
        if( document.children.length > 0 ) {
            history.push('/documentedit/' + document.children[0].child.id );
        }
    }, [document ])

    const onEnteredModal = () => {
        const quillBefore = new Quill('#before', {readOnly : true});
        quillBefore.setContents(before);
        const quill = new Quill('#current', {readOnly : true});
        quill.setContents(current);
        const quillAfter = new Quill('#after', {readOnly : true});
        quillAfter.setContents(after);
    }

    const confirmAmend = ( evt ) => {
        setModalIsOpen(false);
        http.post('/api/amend', {
            id : id ,
            selection : current,
            index : range.index ,
            length : range.length
        }).then(
            data => {
                setReload(! reload );
                //history.push('/document/' + data.data.id );
            },
            error => {
                console.log( error );
            }
        )
    }

    useEffect(() => {
        const param = { readOnly : true, toolbar : '#toolbar' };
        quill = new Quill('#editor', param );
        setEditor( quill );
        http.get('/api/document/' + id ).then(
            data => {
                setDocument( data.data );
                let delta = new Delta(JSON.parse(data.data.document.body));

                data.data.children.map(( object , index ) =>{
                    let link = object.link;
                     let res = [];
                     if(link.index ) {
                         res.push({ retain : link.index });
                     }
                     res.push({ retain : link.length , attributes : { background : '#ffc107'}});
                    return new Delta(res);
                    //console.log( delta );
                }).forEach((delt) => {
                    delta = delta.compose(delt);
                })
                quill.setContents( delta );

            },error => {
                console.log( error )
            }
        )



    }, [ id , reload ]);


    //const { selection } = useSelection(editor);

    return (
        <div>
            <div style={{ display : 'none'}} id="emptyQuill"></div>
            <div style={{ display : 'none'}} id="source"></div>
            <ContextMenu menu={() => { return (<MenuSelectText id={id}></MenuSelectText>);
            }} />
            <h1>{document.document.title}</h1>
            <div className="row">
                <div className="col-sm">
                    <div id="toolbar">
                        <button style={{ display : canAmendCauseEveryBodyReadyForVote ? 'block' : 'none' }} id="custom-button" className="btn btn-sm btn-primary" onClick={amend}>Amend</button>
                        <AmendButton
                            id={id}
                            reload={ () => { setReload( !reload )}}
                            document={document}
                            editor={editor}
                        ></AmendButton>
                        { (document.children.length > 0 && !showAmended) ? <button className="btn btn-primary btn-sm" onClick={showAmend}>Show Ammend</button> : <></> }
                        { (document.children.length > 0 && showAmended) ? <button className="btn btn-primary btn-sm" onClick={editAmend}>Edit Ammend</button> : <></> }
                    </div>
                    <div id="editor"></div>
                    <Link to={{ pathname : '/document/' + (document.child ? document.child.id : null )}}>Child</Link>
                    <button className="btn btn-primary" onClick={() => history.push('/documentedit/'+ id )}>Modifier</button>
                    <Vote id={id}></Vote>

                </div>
                { showAmended ?
                    <div className="col-sm">
                        <div id="rightEditor"></div>
                    </div>
                    : <></>
                }
            </div>
            <EditMenuList menus={leftMenus} load={true} id={id}></EditMenuList>
            <EditMenuList menus={menus} load={false}></EditMenuList>
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
        </div>

    )
}
export default DocumentView;