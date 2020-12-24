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
const Barre = () => {

    const [ right , setRight ] = useState( '0px');
    const [ page , setPage ] = useState( null );
    const { id } = useParams();

    const hide = () => {
        setRight('-50px');
    }


    useEffect( () => {
        //console.log( routeFromHref() );
        history.listen((location, action ) => {
            if( location.pathname.match(/\/document\/(.*)$/)) {
                setPage( 'document');
            }
            if( location.pathname.match(/\/documentedit\/(.*)$/)) {
                setPage( 'documentedit');
            }
        })
        history.push( routeFromHref());

    }, [])

    return (
        <div>
            <div className="rightBarre" style={{ right : right }}>
                { page === 'document' ? <DiffButton></DiffButton> : <></> }
                { page === 'document' ? <AmendButtonBarre></AmendButtonBarre> : <></> }
                { page === 'document' ? <VoteButton id={id}></VoteButton> : <></>}
                { page === 'document' || page === 'documentedit' ? <Documents ></Documents> : <></> }
                { page === 'document' ? <SubscribeBarre></SubscribeBarre> : <></>}
                { page === 'documentedit' ? <ReadyForVoteBarre></ReadyForVoteBarre> : <></> }
                { page === 'documentedit' ? <InviteBarre></InviteBarre> : <></> }
                { page === 'documentedit' ? <SaveDocument></SaveDocument> : <></> }
            </div>
        </div>
    );
}
export default Barre;