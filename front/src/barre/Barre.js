import React, {useState, useEffect, useRef} from 'react';
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
import {useDispatch, useSelector} from "react-redux";
import Notif from "./Notif";
import ShareBarre from "./shareBarre";
import usePrevious from "../utils/usePrevious";
import {initBarreToggle} from "../redux/slice/barreToggleSlice";
import Burger from "./Burger";
import useIsMobile from "../utils/useIsMobile";
const Barre = () => {

    const [ right , setRight ] = useState( '0px');
    const [ page , setPage ] = useState( null );
    const [ _open, setOpen ] = useState( false );

    const isMobile = useIsMobile();

    const classMobile = isMobile ? 'mobile' : '';

    const { id } = useParams();

    const dispatch = useDispatch();

    const hide = () => {
        setRight('-50px');
    }

    const click = useSelector((state) => {
        return state.click.click;
    })


    const prevClick = usePrevious(click);


    useEffect(() => {

        if(click > 0 && click > prevClick) {
            dispatch(initBarreToggle())
        }
    }, [click, prevClick])


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
            <div className={ `rightBarre ${classMobile}`} style={{ right : right }}>
                { page === 'document' || page === 'documentedit' || page === 'documents'? <Notif></Notif> : <></> }
                { page === 'document' ? <DiffButton></DiffButton> : <></> }
                { page === 'document' ? <AmendButtonBarre></AmendButtonBarre> : <></> }
                { page === 'document' ? <VoteButton id={id}></VoteButton> : <></>}
                { page === 'document' || page === 'documentedit' || page === 'documents'? <Documents ></Documents> : <></> }
                { page === 'document' ? <ShareBarre id={id}></ShareBarre> : <></> }
                { page === 'document' ? <SubscribeBarre></SubscribeBarre> : <></>}
                { page === 'documentedit' ? <ReadyForVoteBarre></ReadyForVoteBarre> : <></> }
                { page === 'documentedit' ? <InviteBarre></InviteBarre> : <></> }
                { page === 'documentedit' ? <SaveDocument></SaveDocument> : <></> }
            </div>
        </div>
    );
}
export default Barre;
