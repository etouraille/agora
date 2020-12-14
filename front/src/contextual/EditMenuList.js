import React , { useState, useEffect } from 'react';
import EditMenu from "./EditMenu";
import  { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { add , init } from './../redux/slice/editMenuSlice';
import { init as initReadyForVote } from './../redux/slice/readyForVoteSlice';
import { init as initVote } from './../redux/slice/voteSlice';
import http from "../http/http";
import voteFilter from "../redux/filter/voteFilter";
import { submit } from './../redux/slice/amendSlice';

const EditMenuList = ({ menus, id , load , reload , relative }) => {

    const dispatch = useDispatch();

    const editMenu = useSelector( state => {
        return state.editMenu
    });

    let partialForChange = [];

    useSelector( state => {

        let amend = state.amend.find(elem => elem.id === id );
        if( amend ) {
            amend.children.forEach( elem  => {
                let vote = voteFilter(elem.id) (state);
                //console.log( vote );
                //dispatch( submit( { id : id , child : elem.id }))
                if( vote && vote.majority && elem.submit === false ) {

                    http.get('/api/vote-success-on-doc/' + elem.id  ).then( data => {
                        reload( id );
                        console.log( 'reload' );
                    }, error => {
                        console.log ( error );
                    })

                }
            })
        }
    })



    const [ iter , setIter ] = useState( []);


    useEffect(() => {

        menus.forEach( (elem , index )=> {
            dispatch(add({ id : elem.id}));
        })
        return () => { dispatch( init())}
    }, [menus])

    useEffect(() => {
        if( load ) {
            http.get('/api/ready-for-vote/' + id ).then( data => {
                dispatch(initReadyForVote({id : id , data : data.data}));
            }, error => {
                console.log( error );
            })
            menus.forEach((menu) => {
                if( partialForChange.indexOf( menu.id )=== -1 ) {
                    partialForChange.push( menu.id );
                }
                http.get( '/api/ready-for-vote/' + menu.id ).then( data => {
                    dispatch(initReadyForVote({id : menu.id, data : data.data}));
                }, error => {
                    console.log( error );
                })
                http.get('/api/vote/voters/' + menu.id ).then( data  => {
                    dispatch( initVote({ id : menu.id , data : data.data }))
                }, error => {
                    console.log( error);
                })
            });
        }
    }, [load , menus ])

    return (
        <>
            {editMenu.map((item , id ) => {
                return (


                        <EditMenu
                            key={id}
                            id={item.id}
                            node={ menus[id] ? menus[id].node : null}
                            disp={item.display}
                            reload={reload}
                            relative={relative}
                        >
                        </EditMenu>

                )
            })}
        </>
    )
}
export default EditMenuList;