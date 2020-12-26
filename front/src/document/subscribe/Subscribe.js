import React from 'react';
import http from "../../http/http";
import { useSelector, useDispatch } from "react-redux";
import { sub, unsub } from "../../redux/slice/subscribedSlice";
import { subscribeDoc, unsubscribeDoc } from "./../../redux/slice/documentSubscribeSlice";
import {reload} from "../../redux/slice/reloadDocumentSlice";
const Subscribe = ({ id , reloadFunc }) => {

    const dispatch = useDispatch();

    let user = useSelector( state => state.login.user );

    const subscribed = useSelector( state => {

            let i = state.documentSubscribe.documents.findIndex( elem => elem.id === id )
            if( i >= 0) {
                let j = state.documentSubscribe.documents[i].users.indexOf(state.login.user);
                return j >= 0;
            } else {
                return false;
            }
        }
    )

    const subscribedN = useSelector( state => {
        let elem = state.documentSubscribe.documents.find( elem => elem.id === id );
        let ret = 0;
        if( elem ) {
            ret =  elem.users.length;
        }
        return ret;
    })

    const subscribe = () => {
        http.post('/api/subscribe-doc', { id : id }).then( data => {
            // subscribe des id
            dispatch( sub({ id : id }))
            data.data.forEach( childrenId  => {
                dispatch( sub({ id : childrenId }))

            })
            // subscribe associé au document.
            dispatch( subscribeDoc({id , user }))
            dispatch(reload({id}));
        }, error => {
            console.log( error );
        })
    }

    const unsubscribe = () => {
        http.post('/api/unsubscribe-doc', { id : id }).then( data => {
            dispatch( unsub( { id : id }));
            data.data.forEach( childrenId => {
                dispatch( unsub({ id : childrenId }))

            })
            if( typeof reloadFunc === 'function') {
                reloadFunc();
            }
            dispatch( unsubscribeDoc( {id , user }));
            dispatch(reload({id}));
        }, error => {
            console.log( error );
        })
    }

    return (
        <>
            <strong>{ subscribedN} Inscrits</strong>
            { (subscribed) ?
                <button className="btn btn-danger btn-sm" onClick={unsubscribe}>Unsubscribe</button> :
                <button className="btn btn-primary btn-sm" onClick={subscribe}>Subscribe</button> }
       </>
    )
}
export default Subscribe;