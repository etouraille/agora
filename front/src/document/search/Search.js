import React , {useState, useEffect  } from 'react';
import http from "../../http/http";
import history from "../../utils/history";
import SearchApi from "../../search/SearchApi";

const Search = () => {

    const go = ( id ) => {
        history.push('/document/' + id );
    }


    return (
        <div>
            <SearchApi api={`/api/search-document`} item={(elem => <li key={elem.id} onClick={ evt => go(elem.id )} className="list-group-item">{elem.title}</li>)}></SearchApi>
        </div>
    )
}

export default Search;
