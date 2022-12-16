import {Modal} from "react-bootstrap";
import React, {useEffect} from "react";

const ModalBarre = ({open, setOpen, content, title }) => {




    return (
        <>
            <Modal
                show={open}
                onHide={() => setOpen(false)}
                dialogClassName="modal-xl"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {content()}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={evt => setOpen(false)}>Fermer</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalBarre;
