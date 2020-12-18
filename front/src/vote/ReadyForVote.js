import React , {useCallback , useEffect } from 'react';
import http from "../http/http";
import { useDispatch,useSelector } from 'react-redux';
import {init, set } from './../redux/slice/readyForVoteSlice';
import ok from './../svg/ok.svg';
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
            <div className="padding" style={{ display : !ready ? 'block': 'none'}}>
                <button className="btn btn-black" onClick={setReadyForVote}><img className="logo margin-right" src={ok} />Valider</button>
            </div>
            <div>
                {links.map((elem,i ) =>{
                    return (
                        <div className="small-font padding" key={i}>{elem.user}{ elem.readyForVote ? <img class="logo-small margin-left" src={ok} /> : <></>}</div>
                    )
                }) }
            </div>
        </>
    )
}
export default ReadyForVote;