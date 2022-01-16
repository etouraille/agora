import React, {useEffect, useState} from "react";
import http from "../http/http";

const SearchApi = ({ item , api}) => {
    const [ value , setValue ] = useState( '');
    const [ items, setItems ] = useState( []);

    const onChange= (evt ) => { setValue(evt.target.value)}

    useEffect( () => {
        if( value.length >= 2 ) {
            http.post(api, { data : value }).then( data => {
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
                { items.map( (elem, index) => {
                    return (
                        item(elem, index)
                    )
                })}
            </ul> : <></> }

        </div>
    )
}

export default SearchApi;
