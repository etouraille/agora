import React ,{ useState, useEffect } from "react";
import http from "../http/http";
import { Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { init} from "../redux/slice/subscribedDocsSlice";
import Subscribe from "./subscribe/Subscribe";
import { initDocumentsSubscribe, deleteDoc } from "../redux/slice/documentSubscribeSlice";

const DocumentList = () => {

    const dispatch = useDispatch();

    const [ reload, setReload ] = useState(false );

    const documents = useSelector( state => {
        return state.documentSubscribe.documents;
    })

    useEffect(() => {
        http.get('/api/documents').then(
            data => {
                console.log( data.data );
                dispatch( initDocumentsSubscribe({data: data.data}));
            }, error => {
                console.log(error);
            });


    }, [reload ]);


    const deleteDocument = (id) => {
        http.delete('/api/document/' + id ).then( data => {
            setReload( !reload );
            dispatch( deleteDoc({id }));
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
                      {doc.document.title}

                      <Link to={'/document/' + doc.id }>Display</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteDocument(doc.id)}>Delete</button>
                  </li>
              )
            })}
        </ul>
    )
}

export default DocumentList;