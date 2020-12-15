import React, { useEffect, useState } from 'react';
import EditMenuList from "../../contextual/EditMenuList";
import Quill from 'quill';
import Delta from 'quill-delta';
import $ from 'jquery';
import {useSelector} from "react-redux";
import documentFilter from "../../redux/filter/documentFilter";
import {createSerializableStateInvariantMiddleware} from "@reduxjs/toolkit";
import usePrevious from "../../utils/usePrevious";

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


    useEffect(() => {
        let nodeAndId = [];
        if(  doc.children  && document.querySelector('#rightEditor') ) {


            const sortedChildren = doc.children.sort((elem , elem2) => {
                return ((elem.link.index  < elem2.link.index) ? -1 : 1);
            })


            const righteditor = new Quill('#rightEditor', {readOnly : true });
            const source = new Quill('#source');
            source.setContents(JSON.parse(doc.document.body));



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
                if(b) yellow.push({retain : b , attributes : { background : '#ffc107'}})

                const yellowBackground =  new Delta(yellow);
                deltaIndex = emptyQuill.getLength() - 1 - object.link.length;
                return yellowBackground;
            }).forEach((delta ) => {
                content = content.compose( delta );
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