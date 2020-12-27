import React ,{ useState, useEffect } from "react";
import http from "../http/http";
import { Link } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Subscribe from "./subscribe/Subscribe";
import { initDocumentsSubscribe, deleteDoc } from "../redux/slice/documentSubscribeSlice";
import Search from "./search/Search";

const DocumentList = ({ onClick }) => {

    const dispatch = useDispatch();

    const [ reload, setReload ] = useState(0 );

    const documents = useSelector( state => {
        return state.documentSubscribe.documents;
    })

    useEffect(() => {
        if( reload ) {
            http.get('/api/documents').then(
                data => {
                    dispatch(initDocumentsSubscribe({data: data.data}));
                }, error => {
                    console.log(error);
                });
        }
    }, [reload ]);


    const deleteDocument = (id) => {
        http.delete('/api/document/' + id ).then( data => {
            setReload( reload + 1 );
            dispatch( deleteDoc({id }));
        }, error => {
            console.log( error );
        })
    }

    const reloadFunc = () => {
        setReload( reload + 1  );
    }

    const toggle = () => {
        if( typeof onClick === 'function') {
            onClick();
        }
    }

    return (
        <ul>
            { documents.map((doc, index ) => {
              return (
                  <li key={index}>
                    <Subscribe id={doc.id} reloadFunc={reloadFunc}></Subscribe>
                      {doc.document.title}

                      <Link onClick={toggle} to={'/document/' + doc.id }>Display</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteDocument(doc.id)}>Delete</button>
                  </li>
              )
            })}
        </ul>
    )
}

export default DocumentList;