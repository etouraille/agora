import React , {useCallback , useEffect } from 'react';
import http from "../http/http";
import { useDispatch,useSelector } from 'react-redux';
import {init, set, setNullReadyForVote} from './../redux/slice/readyForVoteSlice';
import ok from './../svg/ok.svg';
import no from './../svg/no.svg';
import _round from './../svg/round.svg';
import canVoteForRound from "../redux/filter/canVoteForRound";
import canIncreaseRound from "../redux/filter/canIncreaseRound";
import isRoundFinished from "../redux/filter/isRoundFinished";
import history from "../utils/history";
const ReadyForVote = ({ id }) => {

    const dispatch = useDispatch();

    const userId = useSelector(state => state.login.userId);

    const _canVote = useSelector(canVoteForRound(id));

    const _canIncreaseRound = useSelector(canIncreaseRound(id));

    const { ready, round } = useSelector(store => {
        const user = store.login.user;
        let readyForVote = false;
        let round = 0;
        if( user ) {
            store.readyForVote.forEach((elem , i ) => {
                if( elem.id === id ) {
                    elem.data.forEach((r, j) => {
                        if( r.user === user ) {
                            readyForVote = r.readyForVote;
                            round = r.round;
                        }
                    })
                }
            })
        }
        return { ready: readyForVote, round };
    })

    const _isRoundFinished = useSelector(isRoundFinished(id));

    const links = useSelector( store => {
        let ret = [];
        store.readyForVote.forEach( elem => {
            if( elem.id === id ) {
                ret = elem.data;
            }
        })
        return ret;
    })

    const increaseRound = (evt) => {
        http.put('/api/round', {id, userId }).then((data) => {
            dispatch(set({id, user: userId, readyForVote: null, round : data.data.round}))
            if (data.data.delete) {
                dispatch(setNullReadyForVote({id}))

            }
        }).catch(err => {
            console.log(err);
        })
    }

    const setReadyForVote = (evt, vote) => {
        evt.stopPropagation();
        http.put('api/ready-for-vote', { id : id , readyForVote : vote}).then( data => {
            dispatch( set ({id : id , user : data.data.user , readyForVote: vote , round : data.data.round  }))
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

    useEffect(() => {
        if(_isRoundFinished) {
            history.push('/document/' + id);
        }
    }, [_isRoundFinished])

    return (
        <>
            <div className="padding" >
                { _canIncreaseRound ? <>{round}<button className="btn btn-black" disabled={!_canIncreaseRound} onClick={(evt) => increaseRound(evt)}><img className="logo margin-right" src={_round} />Next Round</button></>:<></> }
                { _canVote ? <button className="btn btn-black" onClick={(evt) => setReadyForVote(evt, true)}><img className="logo margin-right" src={ok} />Pour</button> : <></> }
                { _canVote ? <button className="btn btn-black" onClick={(evt) => setReadyForVote(evt, false)}><img className="logo margin-right" src={no} />Contre</button> : <></> }
            </div>
            <div>
                {links.map((elem,i ) =>{
                    return (
                        <div className="small-font padding" key={i}>{elem.name}
                            { elem.readyForVote === true ? <img className="logo-small margin-left" src={ok} /> : <></>}
                            { elem.readyForVote === false ? <img className="logo-small margin-left" src={no} /> : <></>}
                        </div>
                    )
                }) }
            </div>
        </>
    )
}
export default ReadyForVote;
