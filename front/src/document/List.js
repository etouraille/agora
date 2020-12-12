import React ,{ useState, useEffect } from "react";
import http from "../http/http";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux";
import { init} from "../redux/slice/subscribedDocsSlice";
import Subscribe from "./subscribe/Subscribe";

const DocumentList = () => {

    const dispatch = useDispatch();

    const [ documents , setDocuments ] = useState([]);
    //const [ li, setLi] = useState('');

    useEffect(() => {
        http.get('/api/documents').then(
            data => {
                setDocuments(data.data);
            }, error => {
                console.log(error);
            });
        http.get('/api/subscribed-doc').then( data => {
            console.log ( data.data );
            dispatch(init({data : data.data }));
        }, error => {
           console.log( error );
        })

    }, []);


    return (
        <ul>
            { documents.map((doc, index ) => {
              return (
                  <li key={index}>{doc.title}
                        <Link to={'/document/' + doc.id }>Display</Link>
                        <Subscribe id={doc.id}></Subscribe>
                  </li>
              )
            })}
        </ul>
    )
}

export default DocumentList;