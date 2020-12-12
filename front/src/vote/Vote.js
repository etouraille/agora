import React, {useCallback} from 'react';
import {useSelector, useDispatch } from "react-redux";
import http from "../http/http";
import { forIt, againstIt } from "../redux/slice/voteSlice";

const Vote = ({ id }) => {

    const dispatch = useDispatch();

    const user = useSelector( state => state.login.user );

    // on peut voter quand le texte a été modifié suffisament et par tout les participants
    const canVote = useSelector( state => {
        let can = false;
        state.readyForVote.forEach( (elem, i ) => {
            if( elem.id === id ) {
                let count = 0;
                elem.data.forEach( (r, j ) => {
                    if( r.readyForVote === true ) {
                        count ++;
                    }
                })
                if( elem.data.length === count ) {
                    can = true;
                }
            }
        })
        return can;
    })

    const vote = useSelector( state => {
        let ret = null;
        if( user ) {
            state.vote.forEach((elem, i) => {
                if (elem.id === id) {
                    elem.votes.forEach((v, j) => {
                        if (v.user === user) {
                            ret = !v.against;
                        }
                    })
                }
            })
        }
        return ret;
    })


    const voteForIt = useCallback(() => {
        if( id && user ) {
            http.post('/api/vote/for', {id: id}).then(data => {
                dispatch(forIt({id: id, user: user}));
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

    return(
        <div style={{ display : canVote ? 'block' : 'none'}}>
            {(vote === null) ? <div>
                <button className="btn btn-success" onClick={voteForIt}>Pour</button>
                <button className="btn btn-danger" onClick={voteAgainstIt}>Contre</button>
            </div>: <div>A voté { vote  ? <strong>Pour</strong> : <strong>Contre</strong>}</div>  }
        </div>
    )
}
export default Vote;