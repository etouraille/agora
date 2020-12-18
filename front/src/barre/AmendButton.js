import React from 'react';
import diff from "../svg/diff.svg";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import { reload as setReload  } from "../redux/slice/reloadDocumentSlice";
import canDisplayAmendFilter from "../redux/filter/canDisplayAmendFilter";
import AmendButton from "../document/amend/AmendButton";
import documentFilter from "../redux/filter/documentFilter";

const AmendButtonBarre = () => {

    const { id } = useParams();

    const canDisplay = useSelector(canDisplayAmendFilter(id));
    const document = useSelector(documentFilter(id));

    const dispatch = useDispatch();

    const reload = () => {
        dispatch(setReload({ id : id }));
    }

    return (
        <>
            { canDisplay ? <div className="barre-elem">
                <div>
                    <AmendButton id={id} document={document} reload={reload}></AmendButton>
                </div>
            </div> : <></> }
        </>
    )
}
export default AmendButtonBarre;