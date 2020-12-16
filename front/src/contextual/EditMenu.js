import React , { useState, useEffect, useCallback  } from 'react';
import $ from 'jquery';
import  { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggle  } from './../redux/slice/editMenuSlice';
import history from "../utils/history";
import Vote from "../vote/Vote";
import http from "../http/http";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
const EditMenu = ({ id , node , disp, reload , relative }) => {

    const dispatch = useDispatch();

    //console.log( 'in edit');
    const canEdit = useSelector( readyForVoteSubscribedFilter(id));

    const canDisplay = useSelector( state => {
        let vote = readyForVoteSubscribedFilter(id)(state);
        return vote.hasSubscribed && (( vote.isOwner && ! vote.isReadyForVote) || vote.isReadyForVote);
    })

    const [x, setX ] = useState(0);
    const [y, setY ] = useState(0);
    const [display, setDisplay] = useState( false );
    const [displayList, setDisplayList] = useState( false );

    useEffect(() => {
        setDisplay(disp);
    }, [disp])

    useEffect(() => {

        const mouseEnter = (evt ) => {
            dispatch(toggle( { id : id }));
            setDisplay(true);
        }
        if(node) {
            if(relative) {
                setX($(node).position()['left']);
                setY($(node).position()['top']);
            } else {
                setX($(node).offset()['left']);
                setY($(node).offset()['top']);
            }
            $(node).on('mouseenter', mouseEnter);
        }


        return () => {
            $(node).off('mouseenter', mouseEnter);
        }
    }, [id, node ]);

    const enterCaret = ( evt ) => {
        setDisplayList(true);
    }

    const outList = ( evt ) => {
        setDisplayList(false );
        setDisplay(false);
    }

    const edit = () => {
        history.push('/documentedit/' + id );
    }

    const deleteDocument = (evt ) => {
        http.delete('/api/document/' + id ).then((data) => {
            reload();
        },error => {
            console.log( error );
        })
    }


    return (
        <>
            { (x > 0 && y > 0 && display && canDisplay ) ? <div style={{
            position : 'absolute',
            left : x + 'px',
            top : y + 'px' ,
            display : ( display  )? 'block' : 'none'
        }}>
            <div className="caret down" onMouseEnter={enterCaret} ></div>
            <div className="menu-container" style={{ display : displayList ? 'block' : 'none', width : '400px'}} onMouseLeave={outList}>
                <nav className="nav flex-column nav-fill">
                    { canEdit && canEdit.isOwner && ! canEdit.isReadyForVote ? <button className="nav-link active" onClick={edit}>Edit</button> : <></> }
                    { canEdit && canEdit.isOwner && ! canEdit.isReadyForVote ? <button className="nav-link active" onClick={deleteDocument}>Delete</button> : <></> }
                    { canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote ? <Vote id={id} forceReload={() => reload()}></Vote> : <></>}
                </nav>
            </div>
        </div>: <></>}
        </>
    )
}
export default EditMenu;