import React, {useCallback, useEffect, useState } from 'react';
import {useSelector, useDispatch } from "react-redux";
import http from "../http/http";
import { forIt, againstIt, init , reset } from "../redux/slice/voteSlice";
import voteFilter from "../redux/filter/voteFilter";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import yes from './../svg/yes.svg';
import no from './../svg/no.svg';
import { reloadVote } from "../redux/slice/reloadVoteSlice";

const Vote = ({ id , forceReload }) => {

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

    const reload = useSelector( state => {
        let elem = state.reloadVote.find( elem => elem.id === id );
        if( elem ) {
            return elem.reload;
        } else {
            return false;
        }
    })

    useEffect(() => {
        //if( reload || autoReload || !autoReload ) {
            http.get('/api/vote/voters/' + id ).then( data => {
                dispatch( init({ id : id , data : data.data }));
            }, error => {
                console.log( error );
            })
        //}
    }, [reload])

    const voteForIt = useCallback(() => {
        if( id && user ) {
            http.post('/api/vote/for', {id: id}).then(data => {
                dispatch(forIt({id: id, user: user}));
                if( data.data.reload && typeof forceReload === 'function') {
                    forceReload();
                    if( data.data.parentId ) {
                        dispatch(reloadVote({id: data.data.parentId}));
                    }
                }
                if( data.data.reload) {
                    dispatch(reloadVote({id}))
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
                if( data.data.reload && typeof forceReload === 'function') {
                    forceReload();
                }
                if( data.data.reload) {
                    dispatch(reloadVote({id}))
                }
            }, error => {
                console.log(error);
            })
        }
    }, [id , user ]);

    const resetVote = () => {
        if( id ) {
            http.delete('/api/vote/' + id ).then(data => {
                dispatch( reset({ id : id }))
                dispatch(reloadVote({id}))
            }, error => {
                console.log(error);
            })
        }
    }

    return(
        <div className="vote-container" style={{ display : readyForVote.isReadyForVote && readyForVote.hasSubscribed ? 'block' : 'none'}}>
            {(vote === null && result && result.final === false && result.complete === false ) ? <div>
                <button className="btn btn-black" onClick={voteForIt}><img className="logo-small" src={yes}/>Pour</button>
                <button className="btn btn-black margin-left" onClick={voteAgainstIt}><img className="logo-small" src={no}/>Contre</button>
            </div>: vote !== null ? <div>J'ai voté { vote  ? <strong>Pour<img className="logo-small margin-left" src={yes}></img></strong> : <strong>Contre<img className="logo-small margin-left" src={no}></img></strong>}</div>: <></>  }
            <div><button className="btn btn-sm btn-danger" onClick={resetVote}>Reset</button></div>
            { result !== null && (result.final || result.complete)? <div>
                { result.success ? <div>Resultat :<img className="logo"src={yes}></img></div> : <div>Résultat : <img className="logo" src={no}></img></div>}
                <div className="small-font"> Pour :
                        <strong className="margin-right">{result.forIt}</strong>
                    - Contre : <strong className="margin-right">{result.againstIt }</strong>
                    - Abstention : <strong>{result.abstention}</strong>
                </div>
                <div className="medium-font">Participants <strong>{result.participants}</strong></div>

            </div>:<></>}
        </div>
    )
}
export default Vote;