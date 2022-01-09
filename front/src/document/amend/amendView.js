import React, {useCallback, useEffect, useState} from 'react';
import EditMenuList from "../../contextual/EditMenuList";
import Quill from 'quill';
import Delta from 'quill-delta';
import $ from 'jquery';
import {useSelector} from "react-redux";
import documentFilter from "../../redux/filter/documentFilter";
import {createSerializableStateInvariantMiddleware} from "@reduxjs/toolkit";
import usePrevious from "../../utils/usePrevious";
import readyForVoteSubscribedFilter from "../../redux/filter/readyForVoteSubscribedFilter";
//import history from "../../utils/history";
import {useHistory} from 'react-router-dom';
import routeFromHref from "../../utils/routeFromHref";

const AmendView = ({id, reload , countParent }) => {

    const [ menus,setMenus ] = useState([]);
    const [ count , setCount ] = useState(0);

    const doc = useSelector(documentFilter(id));

    useEffect(() => {
        setCount( count + 1 );
    }, [ countParent  ])

    const currentReload = () => {
        setCount( count + 1 );
        reload();
    }

    const readyForVote = useSelector(readyForVoteSubscribedFilter(id));

    const sortedChildren = useSelector( state => {
        const doc = documentFilter(id)(state);
        let data = [...doc.children];
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

    const history = useHistory();

    /*
    const cb = useCallback((evt) => {
        if (evt.target.tagName === 'A') {
            history.push(routeFromHref(evt.target.href));
        }
    })
     */

    useEffect(() => {
        let nodeAndId = [];
        if(  doc.children  && document.querySelector('#rightEditor') ) {

            /*
            Quill.register('modules/clink', function(quill, options ) {
                let currentLink = null;
                quill.container.addEventListener('click', cb);

            });
            const righteditor = new Quill('#rightEditor', {readOnly: true, modules: {
                clink: true
            }});
             */
            const righteditor = new Quill('#rightEditor', {readOnly: true });
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
                //if(b) yellow.push({retain : b , attributes : { background : '#ffc107', link: process.env.REACT_APP_front + '/document/' + object.child.id }})
                if(b) yellow.push({retain : b , attributes : { background : '#ffc107' }})

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

    }, [doc])


    return (
        <div>
            <div id="source"></div>
            <div id="emptyQuill"></div>
            <div id="rightEditor"></div>
            <EditMenuList menus={menus} load={false} relative={true} reload={() => currentReload()}></EditMenuList>
        </div>

    )
}
export default AmendView;
