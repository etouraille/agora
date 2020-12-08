import React , {useEffect, useState, useCallback } from 'react';
import http from "../http/http";
import history from "../utils/history";
import { useParams } from "react-router";
import ContextMenu from "../contextual/ContextMenu";
import TextSelector from 'text-selection-react';
import MenuSelectText from "../contextual/MenuSelectText";
import useSelection from "../contextual/useSelection";
import { Link } from 'react-router-dom';
import Quill from 'quill';

const DocumentView = (props) => {
    const { id } = useParams();
    const [ document, setDocument ] = useState({document : { title : null, body : null}, child : {id : null}});
    const [ editor , setEditor ] = useState( null );

    let quill ;

    const amend = useCallback((evt ) => {
        if( quill ) {
            evt.preventDefault();
            const range = quill.getSelection();
            if (range) {
                console.log(quill.getContents(range.index, range.length));
            }
        }

    }, [quill])

    useEffect(() => {
        const param = { readOnly : true, toolbar : '#toolbar' };
        quill = new Quill('#editor', param );
        setEditor( quill );
        http.get('/api/document/' + id ).then(
            data => {
                setDocument( data.data );
                quill.setContents(JSON.parse(data.data.document.body));

            },error => {
                console.log( error )
            }
        )

        var customButton = window.document.querySelector('#custom-button');
        customButton.addEventListener('click', amend);

        return () => {
            customButton.removeEventListener('click', amend );
        }

    }, [ id ]);


    //const { selection } = useSelection(editor);

    return (
        <div>
            <ContextMenu menu={() => { return (<MenuSelectText id={id}></MenuSelectText>);
            }} />
            <h1>{document.document.title}</h1>
            <div id="toolbar">
                <button id="custom-button">Amend</button>
            </div>
            <div id="editor"></div>
            <Link to={{ pathname : '/document/' + (document.child ? document.child.id : null )}}>Child</Link>
            <button className="btn btn-primary" onClick={() => history.push('/documentedit/'+ id )}>Modifier</button>
        </div>

    )
}
export default DocumentView;