import React ,{ useState, useEffect } from "react";
import http from "../http/http";
import { Link } from "react-router-dom";

const DocumentList = () => {


    const [ documents , setDocuments ] = useState([]);
    //const [ li, setLi] = useState('');

    useEffect(() => {
        http.get('/api/documents').then(
            data => {
                setDocuments(data.data);
            }, error => {
                console.log(error);
            });

    }, []);


    return (
        <ul>
            { documents.map((doc, index ) => {
              return <li key={index}>{doc.title}<Link to={'/document/' + doc.id }>Display</Link></li>
            })}
        </ul>
    )
}

export default DocumentList;