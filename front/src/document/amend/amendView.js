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
import {lastChar, truncateChar} from "../../utils/truncateEditor";

const AmendView = ({id, reload , countParent, childrenId }) => {




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
        if (!!!childrenId) {
            Quill.register('modules/clink', function (quill, options) {
                quill.container.addEventListener('click', cb);
                quill.container.addEventListener('contextmenu', cb_context);
            });
        }
        if (doc.children  && window.document.querySelector('#rightEditor_' + count) ) {

            let options = {readOnly: true, modules : { clink : true}};
            if(childrenId) {
                options = {readOnly: true}
            }

            const righteditor = new Quill('#rightEditor_' + count, options);
            //const righteditor = new Quill('#rightEditor', {readOnly: true });
            const source = new Quill('#source_' + count );
            source.setContents(JSON.parse(doc.document.body));

            let hasSubscribed = readyForVote.hasSubscribed;

            let content = sortedChildren[0] ? source.getContents( 0 , sortedChildren[0].link.index ): new Delta(JSON.parse(doc.document.body));

            let deltaIndex = 0;

            let previousLength = 0;
            let textLength = 0;
            let totalLength = 0;


            sortedChildren.map( (object , i ) => {

                let current = JSON.parse( object.child.body );
                console.log( current );
                let afterIndex  = object.link.length + object.link.index;
                let afterLength = source.getLength() - ( object.link.index + object.link.length);
                if(sortedChildren[i+1]) {
                    afterLength = sortedChildren[i+1].link.index - ( object.link.index + object.link.length );
                }
                let delta = new Delta(current);
                if(delta.length() === 0) {
                    delta = new Delta({ops: [{ insert: '#void#'}]});
                    afterIndex = 6 + object.link.index;
                    afterLength = source.getLength() - ( object.link.index + 6);
                    if(sortedChildren[i+1]) {
                        afterLength = sortedChildren[i+1].link.index - ( object.link.index + 6 );
                    }
                }
                let emptyQuill = new Quill('#emptyQuill_' + count );
                emptyQuill.setContents(delta);
                let length = emptyQuill.getLength();
                let currentLength = content.length();
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
                return { delta: yellowBackground, id : object.child.id, length : length ? length : 0 , currentLength };
            }).forEach((data ) => {
                if(hasSubscribed ) {
                    if (childrenId === data.id) {
                        previousLength = data.currentLength;
                        textLength = data.length;
                    }
                    content = content.compose(data.delta);
                    totalLength = content.length();

                }
            })
            righteditor.setContents(content);
            if(childrenId) {
                truncateChar(righteditor, previousLength - Math.round((textLength)*0.3), previousLength + textLength + Math.round((textLength)*0.3));
            }




            deltaIndex = 0;
            sortedChildren.forEach(( object ) => {
                let current = JSON.parse( object.child.body );
                const delta = new Delta(current);
                let emptyQuill = new Quill('#emptyQuill_' + count );
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

    }, [doc.children.length , readyForVote.hasSubscribed, countParent ])


    return (
        <div>
            <div id={`source_${count}`} style={{display: 'none'}}></div>
            <div id={`emptyQuill_${count}`} style={{display: 'none'}}></div>
            <div id={`rightEditor_${count}`}></div>
            { !childrenId ? <ContextMenu
                    id={_id}
                    evt={evt}
                    display={display}
                    reload={() => currentReload()}
                    setDisplay={setDisplayContext}
                    parentId={id}
                ></ContextMenu> : <></> }
            { Array.from(window.document.querySelectorAll("p > a")).map((elem, index) => {
                let _id = elem.href ? idFromRoute(routeFromHref(elem.href)): null;
                return <>{_id && !childrenId? <SwipeAmendItem index={index} elem={elem} id={_id} reload={() => reload()} parentId={id}></SwipeAmendItem>: <></>}</>
            })}
        </div>

    )
}
export default AmendView;
