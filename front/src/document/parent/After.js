import React , { useEffect , useState } from 'react';
import Delta from 'quill-delta';
import QFactory from "../../quill/QFactory";

const After = ({ document, id  }) => {

    const [ before, setBefore ] = useState( new Delta([]));

    useEffect(() => {

        const param = {readOnly: true, toolbar: '#toolbar'};
        let quill = QFactory.get('#afterElem', param);

        if( document.parent ) {
            let parent = new Delta(JSON.parse(document.parent.body));
            let content = parent.slice(document.parentLink.index + document.parentLink.length , parent.length() );
            quill.setContents(content);
        } else {
            quill.setContents( new Delta([]));
        }

    }, [id])


    return (
        <div>
            <div id="afterElem"></div>
        </div>
    )
}
export default After;