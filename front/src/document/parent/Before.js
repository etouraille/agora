import React , { useEffect , useState } from 'react';
import Delta from 'quill-delta';
import QFactory from "../../quill/QFactory";
import {useSelector} from "react-redux";

const Before = ({ document, id , count }) => {

    const [ before, setBefore ] = useState( new Delta([]));

    const recurse = ( parent , elems ) => {
        let content = new Delta(JSON.parse(parent.document.body)).slice(0, parent.link.index);
        elems.push(content);
        if(parent.parent) {
            recurse( parent.parent, elems );
        }
    }

    const reload = useSelector(state => {
        let elem = state.reloadDocument.find( elem => elem.id === id );
        if (elem) return elem.reload;
        else return false;
    })

    useEffect(() => {

        const param = {readOnly: true, toolbar: '#toolbar'};
        let quill = QFactory.get('#beforeElem', param);


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

    }, [id, reload ,count ])


    return (
        <div>
            <div id="beforeElem"></div>
        </div>
    )
}
export default Before;