import arrow from "../svg/arrow_lett_docuent.svg";
import Before from "./parent/Before";
import React from "react";
import {reload as setReload} from "../redux/slice/reloadDocumentSlice";
import AmendView from "./amend/amendView";
import {useParams} from "react-router";

const DocumentAmend = () => {

    const { id } = useParams();

    return (
        <>
            <div>
                <div className="row">
                    <div className="col-sm">
                        <AmendView id={id}
                                   //reload={() => dispatch(setReload({id}))}
                                    countParent={1}
                        ></AmendView>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DocumentAmend;
