import React , {useEffect, useState, useCallback } from 'react';
import http from "../http/http";
import history from "../utils/history";
import { useParams } from "react-router";
import ContextMenu from "../contextual/ContextMenu";
import MenuSelectText from "../contextual/MenuSelectText";
import Delta  from 'quill-delta'
import Quill from 'quill';
import {useDispatch, useSelector} from "react-redux";
import voteFilter from "../redux/filter/voteFilter";
import AmendView from "./amend/amendView";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import { init } from './../redux/slice/amendSlice';

import {add, initWith, off , init as initMenu } from './../redux/slice/editMenuSlice';
import { init as initDoc } from './../redux/slice/documentSlice';
import QFactory from "./../quill/QFactory";
import documentFilter from "../redux/filter/documentFilter";
import hasSubscribedFilter from "../redux/filter/hasSubscribedFilter";
import { initToggleDiff } from "../redux/slice/toggleDiffSlice";
import { initReload , reload as setReload } from "../redux/slice/reloadDocumentSlice";
import { initReloadVote  } from "../redux/slice/reloadVoteSlice";
import Before from "./parent/Before";
import After from "./parent/After";
import {init as initReadyForVote} from "../redux/slice/readyForVoteSlice";
import {init as initVote} from "../redux/slice/voteSlice";
import arrow from './../svg/arrow_lett_docuent.svg';
import ContextMenuAmend from "../contextual/ContextMenuAmend";
import useIsMobile from "../utils/useIsMobile";
import useLoadDocument from "../utils/useLoadDocument";

const DocumentView = (props) => {
    const { id } = useParams();
    const [ editor , setEditor ] = useState( null );
    const [ leftMenus , setLeftMenus ] = useState([]);

    const isMobile = useIsMobile();

    const readyForVote = useSelector(readyForVoteSubscribedFilter(id));
    const vote = useSelector(voteFilter(id));
    const hasSubscribed = useSelector( hasSubscribedFilter(id));

    const dispatch = useDispatch();

    const reload = useSelector(state => {
        let elem = state.reloadDocument.find( elem => elem.id === id );
        if (elem) return elem.reload;
        else return false;
    })


    const { document, count } = useLoadDocument({id, reload });

    const showAmended = useSelector( state => {
        let elem = state.toggleDiff.find( elem => elem.id === id );
        if(elem) return elem.display;
        else return false;
    })


    useEffect(() => {
        const param = { readOnly : true, toolbar : '#toolbar' };
        let quill = QFactory.get('#editor', param );
        setEditor( quill );
        let delta = new Delta(JSON.parse(document.document.body));

        document.children.map(( object , index ) =>{
            let link = object.link;
            let res = [];
            if(link.index && link.length) {
                res.push({ retain : link.index });
            }
            if(link.length) res.push({ retain : link.length , attributes : { background : '#ffc107'}});
            return new Delta(res);

        }).forEach((delt) => {
            if( hasSubscribed ) {
                delta = delta.compose(delt);
            }
        })
        quill.setContents( delta );


        if( hasSubscribed ) {
            // TODO check if it is useful
            // setMenuFunc(document, editor);
        }

    }, [document, hasSubscribed, reload ])


    const prev = useCallback(( id ) => {
        history.push('/document/' + document.parent.document.id );
        dispatch(setReload({id: document.parent.document.id}))
    }, [document]);

    const edit = () => {
        history.push('/documentedit/'+ id );
    }

    let partialForChange = [];




    return (
        <>
            {document.parent && document.parent.document ? <img className="logo logo-prev" src={arrow} onClick={prev}/> : <></> }
            <div>
                <div style={{ display : 'none'}} id="emptyQuill"></div>
                <div style={{ display : 'none'}} id="source"></div>

                <Before document={document} id={id} count={count}></Before>
                <h1>{document.document.title}</h1>
                <div className="row">
                    <div className="col-sm">
                        <div id="editor"></div>
                        <ContextMenuAmend id={id} reload={() => dispatch(setReload({id}))} editor={editor}></ContextMenuAmend>
                        <br />
                        <br />
                        <div>{  ! readyForVote.isReadyForVote && readyForVote.isOwner ?
                            <button type="button" className="btn btn-primary" onClick={edit}>Modifier</button> :
                            <></>
                        }</div>
                    </div>
                    { !isMobile && showAmended ?
                        <div className="col-sm">
                            <AmendView id={id} reload={() => dispatch(setReload({id}))} countParent={count}></AmendView>
                        </div>
                        : <></>
                    }
                </div>
                <After document={document} id={id} count={count}></After>

            </div>
        </>

    )
}
export default DocumentView;
