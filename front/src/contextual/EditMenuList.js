import React , { useState, useEffect } from 'react';
import EditMenu from "./EditMenu";
import  { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { add , init, off } from './../redux/slice/editMenuSlice';
import { init as initReadyForVote } from './../redux/slice/readyForVoteSlice';
import { init as initVote } from './../redux/slice/voteSlice';
import http from "../http/http";
import voteFilter from "../redux/filter/voteFilter";

const EditMenuList = ({ menus, id , load , reload , relative }) => {

    const dispatch = useDispatch();

    const editMenu = useSelector( state => {
        return state.editMenu.data
    });

    let partialForChange = [];

    const [ iter , setIter ] = useState( []);


    useEffect(() => {

        menus.forEach( (elem , index )=> {
            dispatch(add({ id : elem.id}));
        })
        //TODO
        if( menus.length === 0 ) {
            dispatch( off());
            dispatch(init());
        }
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
                if( partialForChange.indexOf( menu.id ) === -1 ) {
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

        return () => {

        }
    }, [ load , menus ])

    return (
        <>
            {editMenu.map((item , id ) => {
                return (


                        <EditMenu
                            key={id}
                            id={item.id}
                            node={ menus[id] ? menus[id].node : null}
                            disp={item.display}
                            reload={() => reload()}
                            relative={relative}
                        >
                        </EditMenu>

                )
            })}
        </>
    )
}
export default EditMenuList;
