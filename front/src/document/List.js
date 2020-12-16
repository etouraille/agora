import React ,{ useState, useEffect } from "react";
import http from "../http/http";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import { init} from "../redux/slice/subscribedDocsSlice";
import Subscribe from "./subscribe/Subscribe";

const DocumentList = () => {

    const dispatch = useDispatch();

    const [ documents , setDocuments ] = useState([]);
    const [ reload, setReload ] = useState(false );

    useEffect(() => {
        http.get('/api/documents').then(
            data => {
                setDocuments(data.data);
            }, error => {
                console.log(error);
            });


    }, [reload ]);


    const deleteDocument = (id) => {
        http.delete('/api/document/' + id ).then( data => {
            setReload( !reload );
        }, error => {
            console.log( error );
        })
    }

    return (
        <ul>
            { documents.map((doc, index ) => {
              return (
                  <li key={index}>
                    <Subscribe id={doc.id}></Subscribe>
                      {doc.title}

                      <Link to={'/document/' + doc.id }>Display</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteDocument(doc.id)}>Delete</button>
                  </li>
              )
            })}
        </ul>
    )
}

export default DocumentList;