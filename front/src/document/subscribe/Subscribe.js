import React from 'react';
import http from "../../http/http";
import { useSelector, useDispatch } from "react-redux";
import { sub, unsub } from "../../redux/slice/subscribedDocsSlice";
import {whenMapDispatchToPropsIsObject} from "react-redux/lib/connect/mapDispatchToProps";

const Subscribe = ({ id }) => {

    const dispatch = useDispatch();

    const subscribed = useSelector( state => {
            //console.log ( state.subscribedDocs );
            let ret = false;
            ret =  -1 !== state.subscribedDocs.docs.indexOf( id )
            return ret;
        }
    )

    const subscribe = () => {
        http.post('/api/subscribe-doc', { id : id }).then( data => {
            dispatch( sub({ id : id }))
        }, error => {
            console.log( error );
        })
    }

    const unsubscribe = () => {
        http.post('/api/unsubscribe-doc', { id : id }).then( data => {
            dispatch( unsub( { id : id }))
        }, error => {
            console.log( error );
        })
    }

    return (
        <>
            { (subscribed) ?
                <button className="btn btn-danger btn-sm" onClick={unsubscribe}>Unsubscribe</button> :
                <button className="btn btn-primary btn-sm" onClick={subscribe}>Subscribe</button> }
       </>
    )
}
export default Subscribe;