import Cookies from "universal-cookie";
import http from "../http/http";
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { subscribeDoc, unsubscribeDoc } from "./../redux/slice/documentSubscribeSlice";
import {useDispatch} from "react-redux";
import {reload as reloadDocument } from "./../redux/slice/reloadDocumentSlice";
import { addVoter, removeVoter , forIt , againstIt } from "./../redux/slice/voteSlice";
import { reloadVote } from "./../redux/slice/reloadVoteSlice";
import { set as setReadyForVote } from './../redux/slice/readyForVoteSlice';
import { sub as subscribeDocument } from './../redux/slice/subscribedSlice';
import store from "../redux/store";

class  MercureSubscribe {

    setEventSource (es) {
        //console.log( es );
        this.eventSource = es;
    }

    init (me, subscribedDoc ) {
        let self = this;
        const EventSource =  EventSourcePolyfill;
        http.get('/api/mercure').then( response => {
            self.close();
            const url = new URL('https://flibus.team/.well-known/mercure');
            subscribedDoc.forEach( id => {
                url.searchParams.append('topic', 'http://agora.org/document/' + id );
            })
            url.searchParams.append('topic', 'http://agora.org/subscribe');
            self.eventSource = new EventSource(url, { headers  : { Authorization :"Bearer " + response.data.token } });
            self.eventSource.onmessage = this.onMessage(me);
            this.setEventSource(self.eventSource);
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
            if (message.subject === "hasSubscribe") {
                // pour l'amend
                // TODO en verité n'a souscrit que s'il a souscrit aux parents.
                // peut se jouer dans le sujet du message qu'on envoie
                // que s'il est sur le parent ultime...
                // et permet de ne souscrire qu'au parent
                // mais pour le front on a quand même besoin de souscrire
                // aux enfants.
                if (user !== me) {
                    store.dispatch(subscribeDocument({id }));
                }
            }
        }
    }

    close() {
        if( this.eventSource ) {
            this.eventSource.close();
        }
    }
}
export default MercureSubscribe;