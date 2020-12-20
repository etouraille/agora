import Cookies from "universal-cookie";
import http from "../http/http";
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { subscribeDoc, unsubscribeDoc } from "./../redux/slice/documentSubscribeSlice";
import {useDispatch} from "react-redux";
import {reload as reloadDocument } from "./../redux/slice/reloadDocumentSlice";
import { addVoter, removeVoter , forIt , againstIt } from "./../redux/slice/voteSlice";
import { reloadVote } from "./../redux/slice/reloadVoteSlice";
import { set as setReadyForVote } from './../redux/slice/readyForVoteSlice';

import store from "../redux/store";

class  MercureSubscribe {




    constructor() {
        this.me = null;
        this.documentIds = [];
        this.eventSource = null;
    }

    init (me) {
        let self = this;
        const EventSource =  EventSourcePolyfill;
        http.get('/api/mercure').then( response => {
            const url = new URL('https://flibus.team/.well-known/mercure');
            url.searchParams.append('topic', 'http://agora.org/document/{id}');
            self.eventSource = new EventSource(url, { headers  : { Authorization :"Bearer " + response.data.token } });
            self.eventSource.onmessage = this.onMessage(me);
        },error => {
            console.log( error);
        })


    }
    setVars(subscribedDoc , me) {
        this.me = me;
        this.documentIds = subscribedDoc;

    }
    onMessage(me) {


        return (data) => {

            const message = JSON.parse(data.data);
            let id = message.id;
            let user = message.user;
            if (message.subject === "docSubscribe") {
                if (user !== me) {
                    store.dispatch(subscribeDoc({id, user}));
                }
            }
            if (message.subject === "docUnsubscribe") {
                if (user !== me) {
                    store.dispatch(unsubscribeDoc({id, user}));
                }
            }
            if (message.subject === "reloadDocument") {
                if (user !== me) {
                    console.log( 'RELOAD DOCUMENT MESSAGE');
                    store.dispatch(reloadDocument({id}));
                    store.dispatch(reloadVote({id}));
                }
            }
            if (message.subject === "addVoter") {
                if (user !== me) {
                    store.dispatch(addVoter({id, user}));
                }
            }
            if (message.subject === "removeVoter") {
                if (user !== me) {
                    store.dispatch(addVoter({id, user}));
                }
            }
            if (message.subject === "voteComplete") {
                if (user !== me) {
                    store.dispatch(reloadVote({id}));
                }
            }
            if (message.subject === "voteFor") {
                if (user !== me) {
                    store.dispatch(forIt({id}));
                }
            }
            if (message.subject === "voteAgainst") {
                if (user !== me) {
                    store.dispatch(againstIt({id}));
                }
            }

            if (message.subject === "setReadyForVote") {
                if (user !== me) {
                    store.dispatch(setReadyForVote({id, user , readyForVote : true }));
                }
            }
        }
    }

    close() {
        if( this.eventSource ) {
            console.log( 'CLOSE EVENT SOURCE =====================');
            this.eventSource.close();
        }
    }
}
export default MercureSubscribe;