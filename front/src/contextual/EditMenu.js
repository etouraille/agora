import React , { useState, useEffect, useCallback  } from 'react';
import $ from 'jquery';
import  { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toggle  } from './../redux/slice/editMenuSlice';
import history from "../utils/history";
import Vote from "../vote/Vote";
import http from "../http/http";
import editSvg from './../svg/edit.svg';
import docSvg from './../svg/doc.svg';
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import voteFilter from "../redux/filter/voteFilter";
import VoteModal from "../document/vote/VoteModal";
import usePrevious from "../utils/usePrevious";
const EditMenu = ({ id , node , disp, reload , relative }) => {

    const dispatch = useDispatch();

    //console.log( 'in edit');
    const canEdit = useSelector( readyForVoteSubscribedFilter(id));

    const vote = useSelector( voteFilter(id ));

    const canDisplay = useSelector( state => {
        let vote = readyForVoteSubscribedFilter(id)(state);
        return vote.hasSubscribed && (( vote.isOwner && ! vote.isReadyForVote) || vote.isReadyForVote);
    })

    const click = useSelector((state) => {
        return state.click.click;
    })

    const prevClick  = usePrevious(click);


    const [x, setX ] = useState(0);
    const [y, setY ] = useState(0);
    const [display, setDisplay] = useState( false );
    const [displayList, setDisplayList] = useState( false );
    const [toggleModal, setToggleModal] = useState( false);



    useEffect(() => {
        if( click > 0 && click> prevClick) {
            setDisplay(false);
        }
    }, [click, prevClick])


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


    const _toggleModal = (evt) => {
        evt.stopPropagation();console.log(1);
        setToggleModal(!toggleModal);
    }

    const _reload = () => {
        setToggleModal(!toggleModal);
        reload();
    }


    return (
        <>
            { (x > 0 && y > 0 && display && canDisplay ) ? <div style={{
            position : 'absolute',
            left : x + 'px',
            top : y + 'px' ,
            display : ( display  )? 'block' : 'none',
            zIndex: 1000
        }}>
            <div className="caret down" onMouseEnter={enterCaret} onClick={_toggleModal} ></div>
            <div className="menu-container" style={{ display : displayList ? 'block' : 'none', width : '400px'}} onMouseLeave={outList}>
                <div className="height-500" onMouseEnter={enterCaret} >
                    { canEdit && canEdit.isOwner && ! canEdit.isReadyForVote ? <img className="logo" src={editSvg} onClick={edit} /> : <></> }
                    { canEdit && canEdit.isOwner && ! canEdit.isReadyForVote ? <button className="nav-link active" onClick={deleteDocument}>Delete</button> : <></> }
                </div>

            </div>
        </div>: <></>}
        </>
    )
}
export default EditMenu;
