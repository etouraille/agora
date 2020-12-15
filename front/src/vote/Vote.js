import React, {useCallback, useEffect } from 'react';
import {useSelector, useDispatch } from "react-redux";
import http from "../http/http";
import { forIt, againstIt, init , reset } from "../redux/slice/voteSlice";
import voteFilter from "../redux/filter/voteFilter";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";

const Vote = ({ id , reload , forceReload }) => {

    const dispatch = useDispatch();

    const user = useSelector( state => state.login.user );

    const result = useSelector( voteFilter(id));

    // on peut voter quand le texte a été modifié suffisament
    // et par tout les participants
    // et qu'on est inscrit au texte ou a son parent

    const readyForVote = useSelector( readyForVoteSubscribedFilter(id));

    const vote = useSelector( state => {
        let ret = null;
        if( user ) {
            state.vote.forEach((elem, i) => {
                if (elem.id === id) {
                    elem.votes.forEach((v, j) => {
                        if (v.user === user && v.against !== null ) {
                            ret = !v.against;
                        }
                    })
                }
            })
        }
        return ret;
    })

    useEffect(() => {
        if( reload ) {
            http.get('/api/vote/voters/' + id ).then( data => {
                dispatch( init({ id : id , data : data.data }));
            }, error => {
                console.log( error );
            })
        }
    }, [reload])

    const voteForIt = useCallback(() => {
        if( id && user ) {
            http.post('/api/vote/for', {id: id}).then(data => {
                dispatch(forIt({id: id, user: user}));
                if( data.data.reload ) {
                    forceReload();
                }
            }, error => {
                console.log(error);
            })
        }
    }, [id , user ]);

    const voteAgainstIt = useCallback(() => {
        if( id && user ) {
            http.post('/api/vote/against', {id: id}).then(data => {
                dispatch(againstIt({id: id, user: user}));
            }, error => {
                console.log(error);
            })
        }
    }, [id , user ]);

    const resetVote = () => {
        if( id ) {
            http.delete('/api/vote/' + id ).then(data => {
                dispatch( reset({ id : id }))
            }, error => {
                console.log(error);
            })
        }
    }

    return(
        <div style={{ display : readyForVote.isReadyForVote && readyForVote.hasSubscribed ? 'block' : 'none'}}>
            {(vote === null) ? <div>
                <button className="btn btn-success" onClick={voteForIt}>Pour</button>
                <button className="btn btn-danger" onClick={voteAgainstIt}>Contre</button>
            </div>: <div>A voté { vote  ? <strong>Pour</strong> : <strong>Contre</strong>}</div>  }
            { result !== null ? <ul>
                    <li>Pour {result.forIt}</li>
                    <li>Contre {result.againstIt}</li>
                    <li>Abstention {result.abstention}</li>
                    <li>Participants {result.total}</li>
                    <li><button className="btn btn-sm btn-danger" onClick={resetVote}>Reset</button></li>
            </ul>:<></>}
        </div>
    )
}
export default Vote;