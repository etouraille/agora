import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import { Router } from 'react-router';
import { Provider } from 'react-redux';
import store from "./redux/store";
import { createMemoryHistory } from "history";
import {BrowserRouter as Router } from "react-router-dom";
import CustomRouter from "./utils/customRouter";
import history from "./utils/history";



ReactDOM.render(
    <CustomRouter history={history}>
      <Provider store={store}>
        <App />
      </Provider>
    </CustomRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
