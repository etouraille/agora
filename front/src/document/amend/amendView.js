import React, {useCallback, useEffect, useState} from 'react';
import Quill from 'quill';
import Delta from 'quill-delta';
import $ from 'jquery';
import {useSelector} from "react-redux";
import documentFilter from "../../redux/filter/documentFilter";
import {createSerializableStateInvariantMiddleware} from "@reduxjs/toolkit";
import usePrevious from "../../utils/usePrevious";
import readyForVoteSubscribedFilter from "../../redux/filter/readyForVoteSubscribedFilter";
import routeFromHref from "../../utils/routeFromHref";
import history from "../../utils/history";
import idFromRoute from "../../utils/idFromRoute";
import ContextMenu from "../../contextual/ContextMenu";
import useLoadDocument from "../../utils/useLoadDocument";
import SwipeAmendItem from "../../swipeable/SwipeAmendItem";

const AmendView = ({id, reload , countParent }) => {

    const [ menus,setMenus ] = useState([]);
    const [ count , setCount ] = useState(0);
    const [ navigateTo, setNavigateTo] = useState(null);
    const [ evt, setEventContext] = useState( null);
    const [_id, setIdContext] = useState( null);
    const [display, setDisplayContext] = useState( false);

    const { doc, document  } = useLoadDocument({id, reload : countParent });

    useEffect(() => {
        setCount( count + 1 );
    }, [ countParent  ])

    useEffect(() => {
        if(navigateTo) {
            history.push(navigateTo);
        }
    }, [navigateTo])

    const currentReload = () => {
        setCount( count + 1 );
        reload();
    }

    const readyForVote = useSelector(readyForVoteSubscribedFilter(id));

    const sortedChildren = useSelector( state => {
        let data = Array.isArray(doc.children) ? [...doc.children] : [];
        let ret = data.sort((elem , elem2) => {
            return ((elem.link.index  < elem2.link.index) ? -1 : 1);
        })
        return ret.map((elem , i ) => {
            let childId = elem.child.id;
            let vote = readyForVoteSubscribedFilter(childId)(state);
            if(! vote.isReadyForVote && (!vote.isOwner || vote.isReadyForVote )) {
                let delt = new Delta(JSON.parse(doc.document.body));
                let body = JSON.stringify(delt.slice(elem.link.index, elem.link.index + elem.link.length));
                let child = {...ret[i].child  , body : body  };
                return {...ret[i], child : child , vote : vote }
            } else {
                let child = {...ret[i].child };
                return {...ret[i], child : child , vote : vote}

            }
        })
    });




    const cb = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        if (evt.target.tagName === 'A') {
            evt.target.removeAttribute('target');

            //history.push(routeFromHref(evt.target.href));
            setDisplayContext(false);
        }
    }

    const cb_context = useCallback((evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        if ( evt.target.tagName === 'A') {
            setEventContext(evt);
            setIdContext(idFromRoute(routeFromHref(evt.target.href)));
            setDisplayContext(true);
        }
    }, [setEventContext, setIdContext, setDisplayContext])




    useEffect(() => {
        let nodeAndId = [];
        Quill.register('modules/clink', function(quill, options ) {
            quill.container.addEventListener('click', cb);
            quill.container.addEventListener('contextmenu', cb_context);
        });
        if (doc.children  && window.document.querySelector('#rightEditor') ) {



            const righteditor = new Quill('#rightEditor', {readOnly: true, modules: {
                clink: true
            }});
            //const righteditor = new Quill('#rightEditor', {readOnly: true });
            const source = new Quill('#source');
            source.setContents(JSON.parse(doc.document.body));

            let hasSubscribed = readyForVote.hasSubscribed;

            let content = sortedChildren[0] ? source.getContents( 0 , sortedChildren[0].link.index ): new Delta(JSON.parse(doc.document.body));

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
                if(b) yellow.push({retain : b , attributes : { background : '#ffc107', link: process.env.REACT_APP_front + '/document/' + object.child.id }})
                //if(b) yellow.push({retain : b , attributes : { background : '#ffc107' }})

                const yellowBackground =  new Delta(yellow);
                deltaIndex = emptyQuill.getLength() - 1 - object.link.length;
                return yellowBackground;
            }).forEach((delta ) => {
                if( hasSubscribed ) {
                    content = content.compose(delta);
                }
            })
            righteditor.setContents(content);


            deltaIndex = 0;
            sortedChildren.forEach(( object ) => {
                let current = JSON.parse( object.child.body );
                const delta = new Delta(current);
                let emptyQuill = new Quill('#emptyQuill');
                emptyQuill.setContents(delta);

                const [ line, index ]  = righteditor.getLeaf(object.link.index + deltaIndex + 1 );
                if( line && line.parent ) {
                    const node = line.parent.domNode;
                    nodeAndId.push({node: node, id: object.child.id});
                }
                deltaIndex = emptyQuill.getLength() - 1 - object.link.length;
            });

        }
        setMenus( nodeAndId );

    }, [doc.children.length ])


    return (
        <div>
            <div id="source" style={{display: 'none'}}></div>
            <div id="emptyQuill" style={{display: 'none'}}></div>
            <div id="rightEditor"></div>
            <ContextMenu id={_id} evt={evt} display={display} reload={() => currentReload()} setDisplay={setDisplayContext}></ContextMenu>
            { Array.from(window.document.querySelectorAll("p > a")).map((elem, index) => {
                let id = elem.href ? idFromRoute(routeFromHref(elem.href)): null;
                return <>{id ? <SwipeAmendItem index={index} elem={elem} id={id} reload={() => reload()}></SwipeAmendItem>: <></>}</>
            })}
        </div>

    )
}
export default AmendView;
