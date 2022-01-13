import React, {useCallback, useEffect, useState} from 'react';
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Vote from "../../vote/Vote";
import readyForVoteSubscribedFilter from "../../redux/filter/readyForVoteSubscribedFilter";
import Attachement from "./Attachement";

const VoteModal = ({id, toggleModal, onChangeToggle, reload }) => {

    const [ open, setOpen ] = useState(false);

    const canEdit = useSelector(readyForVoteSubscribedFilter(id));

    useEffect(() => {
           setOpen(toggleModal);
    }, [toggleModal])

    const onEnteredModal = () => {};

    const onHide = () => {
        setOpen( false);
        onChangeToggle(false);
    }

    return (
        <>
            <Modal
                show={open}
                onHide={onHide}
                dialogClassName="modal-xl"
                aria-labelledby="example-custom-modal-styling-title"
                onEntered={onEnteredModal}
                onClick={evt => {evt.stopPropagation(); console.log(1);}}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Vote { canEdit && canEdit.hasSubscribed && canEdit.isReadyForVote ? <Vote  id={id} forceReload={() => reload()}></Vote> : <></>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Attachement id={id}></Attachement>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={onHide}>Close</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default VoteModal;
