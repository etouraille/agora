import React , {useState, useEffect  } from 'react';
import http from "../../http/http";
import history from "../../utils/history";

const Search = () => {

    const [ value , setValue ] = useState( '');
    const [ items, setItems ] = useState( []);

    const onChange= (evt ) => { setValue(evt.target.value)}

    const go = ( id ) => {
        history.push('/document/' + id );
    }

    useEffect( () => {
        if( value.length >= 2 ) {
            http.post('/api/search', { data : value }).then( data => {
                setItems(data.data);
            })
        } else {
            setItems([]);
        }
    }, [value ]);

    return (
        <div>
            <input className="form-control" onChange={onChange}/>
            { items.length > 0 ? <ul className="list-group">
                { items.map( elem => {
                    return (
                        <li key={elem.id} onClick={ evt => go(elem.id )}className="list-group-item">{elem.title}</li>
                    )
                })}
            </ul> : <></> }

        </div>
    )
}

export default Search;