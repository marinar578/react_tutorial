// var React = require("react");
// var ReactDOM = require("react-dom"); // needed to render to HTML (this is specified because other types of render options exist); more modern; react-dom takes all the React stuff meant for the DOM and puts it in its own package 

// var ReactRouter = require("react-router");
// var Router = ReactRouter.Router;
// var Route = ReactRouter.Route;
// //var Navigation = ReactRouter.Navigation; //mixin

// var History = ReactRouter.History; // mixin
// var createBrowserHistory = require('history/lib/createBrowserHistory'); // will load in code required to do push state

// var h = require('./helpers'); // helper methods from helpers.js



// // Import Components
// import NotFound from './components/NotFound';
// import StorePicker from './components/StorePicker';
// import App from './components/App';


// /*
//     Routes
// */

// var routes = (
//     <Router history={createBrowserHistory()/* passes in history to browser */}>
//         <Route path="/" component={StorePicker}/>
//         <Route path="/store/:storeId" component={App}/>
//         <Route path="*" component={NotFound} />
//     </Router>
// )


// ReactDOM.render(routes, document.querySelector("#main")); // takes two arguments: the thing you want to render and where you want to put it on the page


import React  from 'react';
import ReactDOM  from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';

/*
  Routes
*/

var routes = (
  <Router history={createHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));
