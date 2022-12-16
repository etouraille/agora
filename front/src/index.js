import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import store from "./redux/store";
import history from "./utils/history";
import 'react-toastify/dist/ReactToastify.css';

//useful function. min and max on array
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

ReactDOM.render(

  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
