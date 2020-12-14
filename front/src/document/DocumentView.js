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
import $ from 'jquery';
import EditMenuList from "../contextual/EditMenuList";
import {useDispatch, useSelector} from "react-redux";
import Vote from "../vote/Vote";
import AmendButton from "./amend/AmendButton";
import voteFilter from "../redux/filter/voteFilter";
import AmendView from "./amend/amendView";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import { init } from './../redux/slice/amendSlice';

const DocumentView = (props) => {
    const { id } = useParams();
    const [ document, setDocument ] = useState({document : { title : null, body : null}, children : []});
    const [ editor , setEditor ] = useState( null );
    const [ showAmended , setShowAmended ] = useState( false );
    const [ reload , setReload ] = useState( false );
    const [ leftMenus , setLeftMenus ] = useState([]);

    let quill ;

    const readyForVote = useSelector(readyForVoteSubscribedFilter(id));
    const vote = useSelector(voteFilter(id));

    const dispatch = useDispatch();

    const showAmend = useCallback((evt) => {
        setShowAmended(true);

    }, [ document , showAmended ]);


    useEffect(() => {



    }, [ editor, document ]);

    const editAmend = useCallback((evt) => {
        if( document.children.length > 0 ) {
            history.push('/documentedit/' + document.children[0].child.id );
        }
    }, [document ])




    useEffect(() => {

        const param = { readOnly : true, toolbar : '#toolbar' };
        quill = new Quill('#editor', param );
        setEditor( quill );
        if( id ) {
            http.get('/api/document/' + id ).then(
                data => {
                    setDocument( data.data );
                    let delta = new Delta(JSON.parse(data.data.document.body));
                    console.log( 'RELOAD ================================== RELOAD', data.data );
                    console.log( 'RELOAD ================================== RELOAD', id  );

                    let children = [];

                    data.data.children.map(( object , index ) =>{
                        children.push( object.child.id );
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
                    dispatch(init({id : id , data : children }));
                    quill.setContents( delta );

                    const sortedChildren = data.data.children.sort((elem , elem2) => {
                        return ((elem.link.index  < elem2.link.index) ? -1 : 1);
                    })


                    if( quill && data.data.children.length > 0 ) {
                        let leftMenusTemp = [];
                        sortedChildren.forEach((elem, index ) => {
                            const [ line, offset ] = quill.getLeaf(elem.link.index + 1) || editor.scroll.line( elem.link.index );
                            if( line && line.parent ) {
                                const node = line.parent.domNode;
                                leftMenusTemp.push({node: node, id: elem.child.id});
                            }
                        })
                        setLeftMenus(leftMenusTemp);
                    }

                },error => {
                    console.log( error )
                })
        }

    }, [ reload ]);



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
                        { readyForVote.isReadyForVote && readyForVote.hasSubscribed && vote && vote.fail ? <AmendButton
                            id={id}
                            reload={ () => { setReload( !reload )}}
                            document={document}
                            editor={editor}
                        ></AmendButton> : <></>}
                        { (document.children.length > 0 && !showAmended) ? <button className="btn btn-primary btn-sm" onClick={showAmend}>Show Ammend</button> : <></> }
                        { (document.children.length > 0 && showAmended) ? <button className="btn btn-primary btn-sm" onClick={editAmend}>Edit Ammend</button> : <></> }
                    </div>
                    <div id="editor"></div>
                    <Link to={{ pathname : '/document/' + (document.child ? document.child.id : null )}}>Child</Link>
                    {  ! readyForVote.isReadyForVote && readyForVote.isOwner ?
                        <button className="btn btn-primary" onClick={() => history.push('/documentedit/'+ id )}>Modifier</button> :
                        <></>
                    }
                    <Vote id={id} reload={true}></Vote>

                </div>
                { showAmended ?
                    <div className="col-sm">
                        <AmendView document={document}></AmendView>
                    </div>
                    : <></>
                }
            </div>
            <EditMenuList menus={leftMenus} load={true} id={id} reload={() => setReload(! reload )}></EditMenuList>
            </div>

    )
}
export default DocumentView;