import React, { useEffect, useState } from 'react';
import EditMenuList from "../../contextual/EditMenuList";
import Quill from 'quill';
import Delta from 'quill-delta';
import $ from 'jquery';

const AmendView = ({document}) => {

    const [ menus, setMenus ] = useState([]);

    useEffect( () => {

        if(  document.children && document.children.length > 0  ) {

            const sortedChildren = document.children.sort((elem , elem2) => {
                return ((elem.link.index  < elem2.link.index) ? -1 : 1);
            })


            const righteditor = new Quill('#rightEditor', {readOnly : true });
            const source = new Quill('#source');
            source.setContents(JSON.parse(document.document.body));



            let content = source.getContents( 0 , sortedChildren[0].link.index );



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
            console.log( content );
            righteditor.setContents(content);

            let nodeAndId = [];
            deltaIndex = 0;
            sortedChildren.forEach(( object ) => {
                let current = JSON.parse( object.child.body );
                const delta = new Delta(current);
                let emptyQuill = new Quill('#emptyQuill');
                emptyQuill.setContents(delta);

                const [ line, index ]  = righteditor.getLeaf(object.link.index + deltaIndex + 1 );
                if( line && line.parent ) {
                    const node = line.parent.domNode;
                    console.log($(node).offset());
                    console.log(node);
                    nodeAndId.push({node: node, id: object.child.id});
                }
                deltaIndex = emptyQuill.getLength() - 1 - object.link.length;
            });
            setMenus( nodeAndId );
        }


    }, [document])


    return (
        <div>
            <div id="emptyQuill"></div>
            <div id="rightEditor"></div>
            <EditMenuList menus={menus} load={false} relative={true}></EditMenuList>
        </div>

    )
}
export default AmendView;