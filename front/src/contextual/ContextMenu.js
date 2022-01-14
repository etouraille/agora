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
const ContextMenu = ({ display, evt , id, reload}) => {

    const canEdit = useSelector( readyForVoteSubscribedFilter(id));

    const vote = useSelector( voteFilter(id ));

    console.log( vote);

    const canDisplay = useSelector( state => {
        let vote = readyForVoteSubscribedFilter(id)(state);
        return vote.hasSubscribed && (( vote.isOwner && ! vote.isReadyForVote) || vote.isReadyForVote);
    })

    const [x, setX] = useState('0px');
    const [y, setY] = useState('0px');
    const [toggleModal, setToggleModal] = useState(false);
    const [_display, setDisplay] = useState(false);

    useEffect(() => {
        if(evt) {
            setX(`${evt.x}px`);
            setY(`${evt.y}px`);
        }
    }, [evt, setX, setY])

    useEffect(() => {
        if(typeof display === 'boolean') {
            setDisplay(display);
        }
    }, [display]);

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
            { _display ? (
                <div className="menu-container" style={{ top : y, left : x ,position : 'fixed' }}>
                    <div className="menu-row" onClick={navigate}>
                        <span className="before"><img className="logo-small" src={arrow_right} /></span>
                        <span className="middle">Naviguer</span>
                    </div>
                    <div className="menu-row" onClick={toggle}>
                        <span className="before"><img className="logo-small" src={voteSvg} /></span>
                        <span className="middle">Voter</span>
                    </div>
                    { canEdit && canEdit.isOwner && ! canEdit.isReadyForVote ? <div className="menu-row" onClick={edit}>
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
