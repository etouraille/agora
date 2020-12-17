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

import { initWith } from './../redux/slice/editMenuSlice';
import { init as initDoc } from './../redux/slice/documentSlice';
import ToggleAmend from "./amend/ToggleAmend";
import QFactory from "./../quill/QFactory";
import documentFilter from "../redux/filter/documentFilter";
import hasSubscribedFilter from "../redux/filter/hasSubscribedFilter";
const DocumentView = (props) => {
    const { id } = useParams();
    const [ editor , setEditor ] = useState( null );
    const [ showAmended , setShowAmended ] = useState( false );
    const [ reload , setReload ] = useState( false );
    const [ leftMenus , setLeftMenus ] = useState([]);
    const [ count , setCount ] = useState( 0 );


    const readyForVote = useSelector(readyForVoteSubscribedFilter(id));
    const vote = useSelector(voteFilter(id));
    const hasSubscribed = useSelector( hasSubscribedFilter(id));

    const dispatch = useDispatch();

    const document = useSelector( state => {
        let res =  state.document.find( elem => elem.id === id );
        if( res ) {
            return res.doc;
        } else {
            return { document : { title : null, body : null }, children : []};
        }
    })

    const showAmend = useCallback((evt) => {
        setShowAmended(true);

    }, [ document , showAmended ]);


    const sortedChildren = useSelector( state => {
        const doc = documentFilter(id)(state);
        let ret = doc.children.sort((elem , elem2) => {
            return ((elem.link.index  < elem2.link.index) ? -1 : 1);
        })
        return ret.map(elem => {
            let vote = readyForVoteSubscribedFilter(elem.child.id)(state);
            return { ...elem, vote: vote };
        })

    })

    const editAmend = useCallback((evt) => {
        if( document.children.length > 0 ) {
            history.push('/documentedit/' + document.children[0].child.id );
        }
    }, [document ])

    const setMenuFunc = (doc , quill ) => {
        let leftMenusTemp = [];
        if( quill && doc.children.length > 0 ) {


            sortedChildren.forEach((elem, index ) => {
                const [ line, offset ] = quill.getLeaf(elem.link.index + 1) || editor.scroll.line( elem.link.index );
                if( line && line.parent ) {
                    const node = line.parent.domNode;
                    leftMenusTemp.push({node: node, id: elem.child.id});
                }
            })

        }
        setLeftMenus(leftMenusTemp);
    }

    useEffect(() => {
        const param = { readOnly : true, toolbar : '#toolbar' };
        let quill = new Quill('#editor', param )
        setMenuFunc(document, quill );
    }, [showAmended])



    useEffect(() => {
        if( id ) {
            http.get('/api/document/' + id ).then(
                data => {
                    dispatch( initDoc({id : id, data : data.data }));
                    setCount( count + 1 );
                    let children = [];

                    data.data.children.map(( object , index ) =>{
                        children.push( object.child.id );
                    })
                    dispatch(init({id : id , data : children }));
                    dispatch(initWith({data: children }));

                },error => {
                    console.log( error )
                })
        }

    }, [ reload ]);

    useEffect(() => {
        const param = { readOnly : true, toolbar : '#toolbar' };
        let quill = QFactory.get('#editor', param );
        setEditor( quill );
        let delta = new Delta(JSON.parse(document.document.body));

        document.children.map(( object , index ) =>{
            let link = object.link;
            let res = [];
            if(link.index ) {
                res.push({ retain : link.index });
            }
            res.push({ retain : link.length , attributes : { background : '#ffc107'}});
            return new Delta(res);

        }).forEach((delt) => {
            if( hasSubscribed ) {
                delta = delta.compose(delt);
            }
        })
        quill.setContents( delta );
        if( hasSubscribed ) {
            setMenuFunc(document, editor);
        }

    }, [document, hasSubscribed])


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
                        ></AmendButton> : <></>}
                        { readyForVote.hasSubscribed ?
                            <ToggleAmend showAmend={showAmended} toggle={() => setShowAmended(!showAmended)}></ToggleAmend>
                            : <></> }
                    </div>
                    <div id="editor"></div>
                    {  ! readyForVote.isReadyForVote && readyForVote.isOwner ?
                        <button className="btn btn-primary" onClick={() => history.push('/documentedit/'+ id )}>Modifier</button> :
                        <></>
                    }
                    <Vote id={id} reload={count}></Vote>

                </div>
                { showAmended ?
                    <div className="col-sm">
                        <AmendView id={id} reload={() => setReload(!reload)} countParent={count}></AmendView>
                    </div>
                    : <></>
                }
            </div>
            <EditMenuList menus={leftMenus} load={true} id={id} reload={() => setReload(! reload )}></EditMenuList>
            </div>

    )
}
export default DocumentView;