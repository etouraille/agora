import React , { useState, useEffect } from 'react';
import EditMenu from "./EditMenu";
import  { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { add , init } from './../redux/slice/editMenuSlice';
import { init as initVote } from './../redux/slice/readyForVoteSlice';
import http from "../http/http";

const EditMenuList = ({ menus, id , load  }) => {

    const dispatch = useDispatch();

    const editMenu = useSelector( state => {
        return state.editMenu
    });


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
                dispatch(initVote({id : id , data : data.data}));
            }, error => {
                console.log( error );
            })
        }
    }, [id])

    return (
        <>
            {editMenu.map((item , id ) => {
                return (


                        <EditMenu
                            key={id}
                            id={item.id}
                            node={ menus[id] ? menus[id].node : null}
                            disp={item.display}
                        >
                        </EditMenu>

                )
            })}
        </>
    )
}
export default EditMenuList;