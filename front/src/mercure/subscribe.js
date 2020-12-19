import Cookies from "universal-cookie";
import http from "../http/http";
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { subscribeDoc, unsubscribeDoc } from "./../redux/slice/documentSubscribeSlice";
import {useDispatch} from "react-redux";

import store from "../redux/store";

class  MercureSubscribe {



    constructor(dispatch) {
        this.me = null;
        this.documentIds = [];
        this.eventSource = null;



    }

    init () {
        const EventSource =  EventSourcePolyfill;
        http.get('/api/mercure').then( response => {
            const url = new URL('https://flibus.team/.well-known/mercure');
            url.searchParams.append('topic', 'http://agora.org/document/{id}');
            this.eventSource = new EventSource(url, { headers  : { Authorization :"Bearer " + response.data.token } });
            this.eventSource.onmessage = this.onMessage;
        },error => {
            console.log( error);
        })


    }
    setVars(subscribedDoc , me) {
        this.me = me;
        this.documentIds = subscribedDoc;

    }
    onMessage( data ) {


        const message = JSON.parse( data.data );
        let id = message.id;
        let user = message.user;
        console.log( message );
        if( message.subject === "docSubscribe") {
            if( user !== this.me ) {
                store.dispatch( subscribeDoc({id, user }));
            }
        }
        if( message.subject === "docUnsubscribe") {
            if( user !== this.me ) {
                store.dispatch( unsubscribeDoc({id, user }));
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