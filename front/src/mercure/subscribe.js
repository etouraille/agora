import Cookies from "universal-cookie";
import http from "../http/http";
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { subscribeDoc, unsubscribeDoc } from "./../redux/slice/documentSubscribeSlice";
import {useDispatch} from "react-redux";
import {reload as reloadDocument } from "./../redux/slice/reloadDocumentSlice";
import { addVoter, removeVoter } from "./../redux/slice/voteSlice";
import { reloadVote } from "./../redux/slice/reloadVoteSlice";

import store from "../redux/store";

class  MercureSubscribe {




    constructor(dispatch) {
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
            console.log( 'callback', this.eventSource);
        },error => {
            console.log( error);
        })


    }
    setVars(subscribedDoc , me) {
        this.me = me;
        this.documentIds = subscribedDoc;

    }
    onMessage() {


        return (data) => {

            console.log(this.me);

            const message = JSON.parse(data.data);
            let id = message.id;
            let user = message.user;
            console.log(message);
            if (message.subject === "docSubscribe") {
                if (user !== this.me) {
                    store.dispatch(subscribeDoc({id, user}));
                }
            }
            if (message.subject === "docUnsubscribe") {
                if (user !== this.me) {
                    store.dispatch(unsubscribeDoc({id, user}));
                }
            }
            if (message.subject === "reloadDocument") {
                if (user !== this.me) {
                    store.dispatch(reloadDocument({id}));
                }
            }
            if (message.subject === "addVoter") {
                if (user !== this.me) {
                    store.dispatch(addVoter({id, user}));
                }
            }
            if (message.subject === "removeVoter") {
                if (user !== this.me) {
                    store.dispatch(addVoter({id, user}));
                }
            }
            if (message.subject === "voteComplete") {
                if (user !== this.me) {
                    store.dispatch(reloadVote({id}));
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