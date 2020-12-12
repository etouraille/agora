import React , {useCallback , useEffect } from 'react';
import http from "../http/http";
import { useDispatch,useSelector } from 'react-redux';
import {init, set } from './../redux/slice/readyForVoteSlice';
const ReadyForVote = ({ id }) => {

    const dispatch = useDispatch();

    const ready = useSelector(store => {
        const user = store.login.user;
        let readyForVote = false;
        if( user ) {
            store.readyForVote.forEach((elem , i ) => {
                if( elem.id === id ) {
                    elem.data.forEach((r, j) => {
                        if( r.user === user ) {
                            console.log( r );
                            readyForVote = r.readyForVote;
                        }
                    })
                }
            })
        }
        return readyForVote;
    })

    const links = useSelector( store => {
        let ret = [];
        store.readyForVote.forEach( elem => {
            if( elem.id === id ) {
                ret = elem.data;
            }
        })
        return ret;
    })

    const setReadyForVote = () => {
        http.put('api/ready-for-vote', { id : id }).then( data => {
            dispatch( set ({id : id , user : data.data.user , readyForVote : true }))
        }, error => {
            console.log(error );
        })
    }

    useEffect( () => {

        http.get('/api/ready-for-vote/' + id ).then((data ) => {
            dispatch( init( {id : id , data : data.data }));
        }, error => {
            console.log( error );
        })

    } , [id]);


    return (
        <>
            <div style={{ display : !ready ? 'block': 'none'}}>
                <button className="btn btn-success" onClick={setReadyForVote}>Set Ready For vote</button>
            </div>
            <div style={{ display : ready ? 'block': 'none'}}>Ready For Vote </div>
            <ul>
                {links.map((elem,i ) =>{
                    return (
                        <li>{elem.user}<strong style={{ display : elem.readyForVote ? 'block' : 'none'}}>Ready for vote</strong></li>
                    )
                }) }
            </ul>
        </>
    )
}
export default ReadyForVote;