import Cookies from "universal-cookie";
import http from "../http/http";
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';


class  MercureSubscribe {


    constructor() {
        const EventSource =  EventSourcePolyfill;


        http.get('/api/mercure').then( response => {
            this.setCookie( response.data.token);
            const url = new URL('https://flibus.team/.well-known/mercure');
            url.searchParams.append('topic', 'http://agora.org/votes/{id}');
            const eventSource = new EventSource(url, { headers  : { Authorization :"Bearer " + response.data.token } });
            eventSource.onmessage = (data) => {
                console.log(data);
            }
        },error => {
            console.log( error);
        })

    }
    setCookie(token ) {
        let cookies = new Cookies();
        cookies.set('mercureAuthorization', token , 'flibus.team');
        cookies.set('Path','/subscribe');
        cookies.set('httponly');
        cookies.set('domain', '.localhost:3000');
        //cookies.set('SameSite', 'strict');
    }


}
export default MercureSubscribe;