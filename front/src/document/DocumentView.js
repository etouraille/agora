import React , {useEffect, useState, useCallback } from 'react';
import http from "../http/http";
import history from "../utils/history";
import { useParams } from "react-router";
import ContextMenu from "../contextual/ContextMenu";
import MenuSelectText from "../contextual/MenuSelectText";
import Delta  from 'quill-delta'
import Quill from 'quill';
import EditMenuList from "../contextual/EditMenuList";
import {useDispatch, useSelector} from "react-redux";
import voteFilter from "../redux/filter/voteFilter";
import AmendView from "./amend/amendView";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import { init } from './../redux/slice/amendSlice';

import { initWith } from './../redux/slice/editMenuSlice';
import { init as initDoc } from './../redux/slice/documentSlice';
import QFactory from "./../quill/QFactory";
import documentFilter from "../redux/filter/documentFilter";
import hasSubscribedFilter from "../redux/filter/hasSubscribedFilter";
import { initToggleDiff } from "../redux/slice/toggleDiffSlice";
import { initReload , reload as setReload } from "../redux/slice/reloadDocumentSlice";
import { initReloadVote  } from "../redux/slice/reloadVoteSlice";
import Before from "./parent/Before";
import After from "./parent/After";
import UploadFile from "../upload/UploadFile";

const DocumentView = (props) => {
    const { id } = useParams();
    const [ editor , setEditor ] = useState( null );
    const [ leftMenus , setLeftMenus ] = useState([]);
    const [ count , setCount ] = useState( 0 );

    const readyForVote = useSelector(readyForVoteSubscribedFilter(id));
    const vote = useSelector(voteFilter(id));
    const hasSubscribed = useSelector( hasSubscribedFilter(id));

    const dispatch = useDispatch();

    const reload = useSelector(state => {
        let elem = state.reloadDocument.find( elem => elem.id === id );
        if (elem) return elem.reload;
        else return false;
    })

    const document = useSelector( state => {
        let res =  state.document.find( elem => elem.id === id );
        if( res ) {
            return res.doc;
        } else {
            return { document : { title : null, body : null }, children : []};
        }
    })

    const showAmended = useSelector( state => {
        let elem = state.toggleDiff.find( elem => elem.id === id );
        if(elem) return elem.display;
        else return false;
    })



    const sortedChildren = useSelector( state => {
        const doc = documentFilter(id)(state);
        let res = [];
        if( doc && doc.children ) {
            const data = [...doc.children];

            let ret = data.sort((elem, elem2) => {
                return ((elem.link.index < elem2.link.index) ? -1 : 1);
            })
            res = ret.map(elem => {
                let vote = readyForVoteSubscribedFilter(elem.child.id)(state);
                return {...elem, vote: vote};
            })
        }
        return res;
    })

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
                    if( data.data.parent && data.data.parent.link && data.data.parent.link.voteComplete ) {
                        history.push( '/document/' + data.data.parent.document.id );
                        return;
                    }
                    /*
                    if( data.data.children === undefined ) {
                        history.push('/403');
                        return;
                    }
                     */
                    dispatch( initDoc({id : id, data : data.data }));
                    setCount( count + 1 );
                    let children = [];

                    const res  = [ ...data.data.children ];
                    let ret = res.sort((elem , elem2) => {
                        return ((elem.link.index  < elem2.link.index) ? -1 : 1);
                    })

                    ret.map(( object , index ) =>{
                        children.push( object.child.id );
                    })
                    dispatch(init({id : id , data : children }));
                    dispatch(initWith({data: children }));
                    dispatch(initToggleDiff({id : id  }));
                    dispatch( initReload({id : id }))
                    dispatch( initReloadVote({id : id }));
                },error => {
                    console.log( error )
                })
        }

    }, [ reload , id ]);

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

    }, [document, hasSubscribed, reload ])

    const prev = useCallback(( id ) => {
        history.push('/document/' + document.parent.document.id );
    }, [document]);

    const edit = () => {
        history.push('/documentedit/'+ id );
    }

    return (
        <div>
            <div style={{ display : 'none'}} id="emptyQuill"></div>
            <div style={{ display : 'none'}} id="source"></div>
            <ContextMenu menu={() => { return (<MenuSelectText id={id}></MenuSelectText>);
            }} />
            <Before document={document} id={id} count={count}></Before>
            {document.parent && document.parent.document ? <button className="btn btn-black" onClick={prev}>Précédent</button> : <></> }
            <h1>{document.document.title}</h1>
            <div className="row">
                <div className="col-sm">
                    <div id="editor"></div>
                    <br />
                    <br />
                    <div>{  ! readyForVote.isReadyForVote && readyForVote.isOwner ?
                        <button type="button" className="btn btn-primary" onClick={edit}>Modifier</button> :
                        <></>
                    }</div>
                </div>
                { showAmended ?
                    <div className="col-sm">
                        <AmendView id={id} reload={() => dispatch(setReload({id}))} countParent={count}></AmendView>
                    </div>
                    : <></>
                }
            </div>
            <After document={document} id={id} count={count}></After>
            <EditMenuList display={false} menus={leftMenus} load={true} id={id} reload={() => dispatch(setReload({id}))}></EditMenuList>
        </div>

    )
}
export default DocumentView;
