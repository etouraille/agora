import React, {useEffect, useState} from 'react';
import useContext from "./useContext";
import history from "../utils/history";
import arrow_right from '../svg/arrow_right_document.svg'
import voteSvg from '../svg/vote.svg';
import VoteModal from "../document/vote/VoteModal";
import editSvg from "../svg/edit.svg";
import {useSelector} from "react-redux";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import voteFilter from "../redux/filter/voteFilter";
import docSvg from "../svg/doc.svg";
import Vote from "../vote/Vote";
import usePrevious from "../utils/usePrevious";
import canVoteFilter from "../redux/filter/canVoteFilter";
import canGoToDoc from "../redux/filter/canGoToDoc";
import canEditFilter from "../redux/filter/canEditFilter";
const ContextMenu = ({ display, evt , id, reload, setDisplay}) => {


    const vote = useSelector( voteFilter(id ));

    const click = useSelector((state) => state.click.click);

    const prevClick = usePrevious(click);

    const canVote = useSelector(canVoteFilter(id));

    const canEdit = useSelector(canEditFilter(id));

    const canGoDoc = useSelector(canGoToDoc(id))

    useEffect(() => {
        if( click > 0 && click > prevClick && typeof setDisplay === 'function') {
            setDisplay(false);
        }
    }, [prevClick, click, setDisplay]);

    const canDisplay = useSelector( state => {
        let vote = readyForVoteSubscribedFilter(id)(state);
        return vote.hasSubscribed && (( vote.isOwner && ! vote.isReadyForVote) || vote.isReadyForVote);
    })

    const [x, setX] = useState('0px');
    const [y, setY] = useState('0px');
    const [toggleModal, setToggleModal] = useState(false);
    const [_display, _setDisplay] = useState(false);

    useEffect(() => {
        if(evt) {
            setX(`${evt.x}px`);
            setY(`${evt.y}px`);
        }
    }, [evt, setX, setY])




    const navigate = (evt) => {
        evt.stopPropagation();
        history.push('/document/' + id );
        setDisplay(false);
    }

    const toggle = (e) => {
        e.stopPropagation();
        setToggleModal(!toggleModal);
        setDisplay(false);
    }

    const edit = (e) => {
        e.stopPropagation();
        history.push('/documentedit/' + id );
        setDisplay(false);
    }

    const _reload = () => {
        reload();
    }

    return (
        <div>
            { display && !(!canGoDoc && !canVote && !canEdit) ? (
                <div className="menu-container" style={{ top : y, left : x ,position : 'fixed' }}>
                    { canGoDoc  ? <div className="menu-row" onClick={navigate}>
                        <span className="before"><img className="logo-small" src={arrow_right} /></span>
                        <span className="middle">Naviguer</span>
                    </div> : <></> }
                    { canVote ? <div className="menu-row" onClick={toggle}>
                        <span className="before"><img className="logo-small" src={voteSvg} /></span>
                        <span className="middle">Voter</span>
                    </div> : <></> }
                    { canEdit ? <div className="menu-row" onClick={edit}>
                        <span className="before"><img className="logo-small" src={editSvg} /></span>
                        <span className="middle">Modifier</span>
                    </div> : <></> }
                </div>
            ) : (<></>)}
            <VoteModal id={id} toggleModal={toggleModal} onChangeToggle={setToggleModal} reload={_reload}></VoteModal>
        </div>
    )
}
export default ContextMenu;
