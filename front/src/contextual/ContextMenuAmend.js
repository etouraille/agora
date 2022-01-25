import React, {useCallback, useEffect, useState} from 'react';
import useContext from "./useContext";
import history from "../utils/history";
import arrow_right from '../svg/arrow_right_document.svg'
import voteSvg from '../svg/vote.svg';
import VoteModal from "../document/vote/VoteModal";
import editSvg from "../svg/edit.svg";
import {useDispatch, useSelector} from "react-redux";
import readyForVoteSubscribedFilter from "../redux/filter/readyForVoteSubscribedFilter";
import voteFilter from "../redux/filter/voteFilter";
import docSvg from "../svg/doc.svg";
import Vote from "../vote/Vote";
import usePrevious from "../utils/usePrevious";
import canDisplayAmendFilter from "../redux/filter/canDisplayAmendFilter";
import documentFilter from "../redux/filter/documentFilter";
import AmendButton from "../document/amend/AmendButton";
import junction from './../svg/junction.svg';
import QFactory from "../quill/QFactory";
import idFromRoute from "../utils/idFromRoute";
import routeFromHref from "../utils/routeFromHref";
import useIsMobile from "../utils/useIsMobile";
import useSwipeAmend from "../swipeable/useSwipeAmend";
import {toggleAmend} from "../redux/slice/toggleAmend";

const ContextMenuAmend = ({ id, reload , editor}) => {


    const canDisplay = useSelector(canDisplayAmendFilter(id));
    const document = useSelector(documentFilter(id));

    const isMobile = useIsMobile();

    const { ref } = useSwipeAmend({editor, id });

    const [ evt, setEvt ] = useState(null);
    const [ display, setDisplay ] = useState( false );
    const [ clickEvent, setClickEvent ] = useState(null);
    const [ hasRange, setHasRange ] = useState(false);

    const click = useSelector((state) => state.click.click);

    const dispatch = useDispatch();

    const prevClick = usePrevious(click);

    const cb_context = useCallback((evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        //if ( evt.target.tagName === 'A') {
            setEvt(evt);
            setDisplay(true);
        //}
    }, [setEvt, setDisplay])

    useEffect(() => {
        if( editor && !isMobile ) {
            editor.container.addEventListener('contextmenu', cb_context);
            //editor.container.addEventListener('onclick', (evt) => evt.preventDefault());
        } else if (editor && isMobile ) {
            ref(editor.container);
        }
    }, [editor])

    useEffect(() => {
        if (editor && editor.getSelection() && editor.getSelection().length) {
            setHasRange(true);
        } else {
            setHasRange(false);
        }
    }, [editor && editor.getSelection()]);


    useEffect(() => {
        if( click > 0 && click > prevClick && typeof setDisplay === 'function') {
            setDisplay(false);
        }
    }, [prevClick, click, setDisplay]);


    const [x, setX] = useState('0px');
    const [y, setY] = useState('0px');

    useEffect(() => {
        if(evt) {
            setX(`${evt.x}px`);
            setY(`${evt.y}px`);
        }
    }, [evt, setX, setY])


    const _click = ( evt ) => {
        evt.preventDefault();
        //setDisplay(!display);
        //setClickEvent(evt);
    }

    const _onClick= (evt) => {
        evt.stopPropagation();
        evt.nativeEvent.stopImmediatePropagation();


        evt.preventDefault();
        //evt.nativeEvent.stopPropagation();

        evt.persist();
        evt.preventDefault();
        evt.stopPropagation();

        dispatch(toggleAmend({from: 'context-menu'}));

        setClickEvent(evt);
        //forceUpdate();

        setTimeout(() => {
            setDisplay(false);
        }, 200);
    };

    console.log( display, canDisplay, hasRange );

    return (
        <div>
            { display && canDisplay && hasRange && !isMobile ? (
                <div className="menu-container" style={{ top : y, left : x ,position : 'fixed', zIndex: 7000 }}>
                    <div className="menu-row" onClick={(evt) => _onClick(evt)}>
                        <span className="before"><img  className="logo-small" src={junction} /></span>
                        <span className="middle" style={{cursor:'pointer'}}></span>
                    </div>
                </div>
            ) : (<></>)}
            <AmendButton
                label="context-menu"
                id={id}
                noIcon={true}
                document={document}
                reload={reload}
                onClick={(evt) => _click(evt)}
            ></AmendButton>
        </div>
    )
}
export default ContextMenuAmend;
