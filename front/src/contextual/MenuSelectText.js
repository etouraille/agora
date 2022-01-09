import React  ,{useCallback , useEffect } from 'react';

import http from './../http/http';
import usePrevious from './../utils/usePrevious'
import history from './../utils/history';
import Quill from 'quill';

const MenuSelectText = ({selection, id }) => {

    const previousSel = usePrevious(selection);

    useEffect(() => {
        const quill = new Quill('#text', { readOnly : true });
        quill.setContents(selection );
    }, [selection])

    const invite = useCallback((evt) => {
        history.push('/invite/' + id );
    }, [id ])

    const amend = useCallback((evt) => {
        evt.preventDefault();

        http.post('/api/amend', { id : id , selection : previousSel }).then(
            data => {
                history.push('/document/' + data.data.id );
            },
            error => {
                console.log( error );
            }
        )
    }, [ id , previousSel])

    return (
        <nav style={{ border : '1px solid black' , zIndex : 100 , backgroundColor : 'red' , color : 'blue'}} className="nav flex-column">
            <button className="nav-link active" onClick={ (evt) =>  amend(evt) }>ammend</button>
            <div id="text"></div>
            <button className="nav-link active" onClick={ (evt) =>  invite(evt) }>Invite for edition</button>

        </nav>
    )
}
export default MenuSelectText;
