import history from "../utils/history";
import { logout } from "../redux/slice/loginSlice";
import store from "../redux/store";
import Cookies from 'universal-cookie';
const axios = require('axios').default;



const http = axios.create({
    baseURL : process.env.REACT_APP_api,
    headers : { 'Content-Type': 'application/json' }
});

http.interceptors.request.use((config) => {
    if (config.url.match(/^https?/)) {
        config['baseURL'] = config.url;
        config['url'] = '';
    }
    let token = localStorage.getItem('token');
    if( token ) {
        config['headers']['Authorization'] = 'Bearer ' + token;
    }
    let cookie = new Cookies();
    let subscribeToken = cookie.get('subscribeToken');
    console.log(subscribeToken);
    if(subscribeToken) {
        config['headers']['SubscribeToken'] = subscribeToken;
    }

    return config;
}, (error) => {
    return Promise.reject( error );
})

http.interceptors.response.use( response => {
    const token = response.headers.token;
    if(token ) {
        localStorage.setItem('token', token  );
    }
    return response;
}, error => {

    if( error.response?.status === 401 ) {
        store.dispatch(logout());
        history.push('/login');

    }
    return Promise.reject( error );
})

export default http;
