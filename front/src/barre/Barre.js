import React , { useState, useEffect  }from 'react';
import history from "../utils/history";
import routeFromHref from "../utils/routeFromHref";
import DiffButton from "./DiffButton";
import AmendButtonBarre from "./AmendButton";
import VoteButton from "./VoteButton";
import {useParams} from "react-router";
import ReadyForVoteBarre from "./ReadyForVoteBarre";
import InviteBarre from "./InviteBarre";
import SaveDocument from "./SaveDocument";
import Documents from "./Documents";
import SubscribeBarre from "./SubscribeBarre";
import {useDispatch} from "react-redux";
const Barre = () => {

    const [ right , setRight ] = useState( '0px');
    const [ page , setPage ] = useState( null );
    const { id } = useParams();

    const hide = () => {
        setRight('-50px');
    }

    const dispatch = useDispatch();
    useEffect( () => {
        //console.log( routeFromHref() );
        let mounted = true;
        history.listen((location, action ) => {
            if( mounted ) {
                if( location.pathname.match(/\/document\/(.*)$/)) {
                    setPage( 'document');
                }
                if( location.pathname.match(/\/documentedit\/(.*)$/)) {
                    setPage( 'documentedit');

                }
                if( location.pathname.match(/\/documents$/)) {
                    setPage( 'documents');
                }
            }
        })
        history.push( routeFromHref());

        return () => { mounted = false; }

    }, [id])

    return (
        <div>
            <div className="rightBarre" style={{ right : right }}>
                { page === 'document' ? <DiffButton></DiffButton> : <></> }
                { page === 'document' ? <AmendButtonBarre></AmendButtonBarre> : <></> }
                { page === 'document' ? <VoteButton id={id}></VoteButton> : <></>}
                { page === 'document' || page === 'documentedit' || page === 'documents'? <Documents ></Documents> : <></> }
                { page === 'document' ? <SubscribeBarre></SubscribeBarre> : <></>}
                { page === 'documentedit' ? <ReadyForVoteBarre></ReadyForVoteBarre> : <></> }
                { page === 'documentedit' ? <InviteBarre></InviteBarre> : <></> }
                { page === 'documentedit' ? <SaveDocument></SaveDocument> : <></> }
            </div>
        </div>
    );
}
export default Barre;