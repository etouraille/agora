import React , { useEffect , useState } from 'react';
import Delta from 'quill-delta';
import QFactory from "../../quill/QFactory";
import {useSelector} from "react-redux";

const After = ({ document, id , count }) => {

    const recurse = ( parent , elems ) => {
        let doc = new Delta(JSON.parse(parent.document.body));
        let content = doc.slice(parent.link.index + parent.link.length , doc.length());
        elems.push(content);
        if(parent.parent) {
            recurse( parent.parent, elems );
        }
    }

    useEffect(() => {

        const param = {readOnly: true, toolbar: '#toolbar'};
        let quill = QFactory.get('#afterElem', param);

        if( document.parent && document.parent.document ) {
            let elems = [];
            recurse( document.parent, elems );
            let current = elems.pop();
            let delta = new Delta([]);
            while( current ) {
                delta = delta.concat( current);
                current = elems.pop();
            }
            quill.setContents(delta);
        } else {
            quill.setContents( new Delta([]));
        }

    }, [id, count ])


    return (
        <div>
            <div id="afterElem" style={{ zIndex : 0}}></div>
        </div>
    )
}
export default After;
