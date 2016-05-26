var React = require("react");
var ReactDOM = require("react-dom"); // needed to render to HTML (this is specified because other types of render options exist); more modern; react-dom takes all the React stuff meant for the DOM and puts it in its own package 
var CSSTransitionGroup = require("react-addons-css-transition-group");


var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; //mixin

var History = ReactRouter.History; // mixin
var createBrowserHistory = require('history/lib/createBrowserHistory'); // will load in code required to do push state

var h = require('./helpers'); // helper methods from helpers.js

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass("https://catchreacttutorial.firebaseio.com/");

var Catalyst = require('react-catalyst');
/* 
    App
*/

var App = React.createClass({
    mixins : [  Catalyst.LinkedStateMixin ],

    getInitialState : function() {
        return{
            fishes : {},
            order : {}
        }
    },

    componentDidMount : function() {
        base.syncState( this.props.params.storeId + '/fishes', {
            context : this,
            state : 'fishes'
        });

        var localStorageRef = localStorage.getItem('order-' + this.props.params.storeID);

        if(localStorageRef){
            // update our component state to reflect what is in localStorage
            this.setState({
                order : JSON.parse(localStorageRef)
            });
        }
    },

    componentWillUpdate : function(nextProps, nextState) {
        localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order))
    },

    addToOrder : function(key){
        this.state.order[key] = this.state.order[key] + 1 || 1;
        this.setState({ order : this.state.order });
    },

    removeFromOrder : function(key){
        delete this.state.order[key]
        this.setState({ order : this.state.order });
    },

    addFish : function(fish){
        var timestamp = (new Date()).getTime();

        // update the state object
        this.state.fishes['fish-' + timestamp] = fish;

        // set the state
        this.setState({ fishes : this.state.fishes }); // updates only the fishes object because that's the only thing that changed
    },

    removeFish : function(key){
        if(confirm("Are you sure you want to remove this fish?")){
            this.state.fishes[key] = null;
            this.setState({ fishes : this.state.fishes });
        };
    }, 

    loadSamples : function() {
        this.setState({
            fishes : require('./sample-fishes')
        });
    },

    renderFish : function(key){
        return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
    },

    render : function(){
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        { Object.keys(this.state.fishes).map(this.renderFish) }
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
                <Inventory addFish = {this.addFish} loadSamples = {this.loadSamples} fishes = {this.state.fishes} linkState = {this.linkState} removeFish = {this.removeFish}/>
            </div>

        )
    }
});

/*
    Fish
    <Fish />
*/
var Fish = React.createClass({
    onButtonClick : function(){
        console.log("Going to add current fish: " + this.props.index);
        var key = this.props.index;
        this.props.addToOrder(key);
    },

    render : function(){
        var details = this.props.details;
        var isAvailable = (details.status === "available" ? true : false);
        var buttonText = (isAvailable ? "Add To Order" : "Sold Out!");
        return(
            <li className="menu-fish">
                <img src={ details.image } alt={ details.name }/>
                <h3 className="fish-name">
                    { details.name }
                    <span className="price">{ h.formatPrice(details.price) }</span>
                </h3>
                <p>{ details.desc }</p>
                <button disabled={ !isAvailable  } onClick={ this.onButtonClick }>{ buttonText }</button>
            </li>
        )
    }
})


/*
    Add Fish Form
    <AddFishForm />
*/
var AddFishForm = React.createClass({
    // mixins : [History],

    createFish : function(event) {
        // 1. Stop the form from submitting
        event.preventDefault();

        // 2. Take the data from the form and create an object
        var fish = {
            name : this.refs.name.value,
            price : this.refs.price.value,
            status : this.refs.status.value,
            desc : this.refs.desc.value,
            image : this.refs.image.value
        }

        // 3. Add the fish to the App state
        this.props.addFish(fish);
        this.refs.fishForm.reset();

    },

    render : function(){
        return(
            <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
                <input type="text" ref="name" placeholder="Fish Name" />
                <input type="text" ref="price" placeholder="Fish Price" />
                <select ref="status">
                    <option value="avaiable">Fresh!</option>
                    <option value="unavaiable">Sold Out!</option>
                </select>
                <textarea type="text" ref="desc" placeholder="Desc"></textarea>
                <input type="text" ref="image" placeholder="Url to Image" />
                <button type="submit">+ Add Item</button>
            </form>
        )
    }
})



/*
    Header
    <Header/>
*/
var Header = React.createClass({
    render : function(){
        return(
            <header className="top">
                <h1>Catch 
                    <span className="ofThe">
                        <span className="of">of </span>
                        <span className="the">the </span>
                    </span>
                Day</h1>
                <h3 className="tagline"><span>{ this.props.tagline }</span></h3>
            </header>
        )
    }
})

/*
    Order
    <Order/>
*/
var Order = React.createClass({
    renderOrder : function(key) {
        var fish = this.props.fishes[key];
        var count = this.props.order[key];
        var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>

        if(!fish) {
            return <li key={key}>Sorry, fish no longer available! {removeButton} </li>
        }

        return(
            <li key={key}>
                {count}lbs
                {fish.name}
                <span className="price">{h.formatPrice(count * fish.price)}</span>
                {removeButton}
            </li>
        )
    },

    render : function() {
        var orderIds = Object.keys(this.props.order);

        var total = orderIds.reduce((prevTotal, key)=> {
            var fish = this.props.fishes[key];
            var count = this.props.order[key];
            var isAvailable = fish && fish.status === "available";

            if(fish && isAvailable){
                return prevTotal + (count * parseInt(fish.price) || 0);
            }

            return prevTotal;
        }, 0);

        return(
            <div className="order-wrap">
                <h2 className="order-title">Your order</h2>
                <CSSTransitionGroup 
                    className="order" 
                    component="ul" 
                    transitionName="order"
                    transitionEnterTimeout={500}
                    transitionLeave Timeout={500}

                 >
                {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total: </strong>
                        {h.formatPrice(total)}
                    </li>
                </CSSTransitionGroup>
            </div>
        )
    }
})

/*
    Inventory
    <Inventory/>
*/
var Inventory = React.createClass({
    renderInventory : function(key){
        var linkState = this.props.linkState;
        return(
            <div className="fish-edit" key={key}>
                <input type="text" valueLink={linkState('fishes.'+ key +'.name')}/>
                <input type="text" valueLink={linkState('fishes.'+ key +'.price')}/>
                <select valueLink={linkState('fishes.'+ key +'.status')}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea valueLink={linkState('fishes.'+ key +'.desc')} ></textarea>
                <input type="text" valueLink={linkState('fishes.'+ key +'.image')}  />
                <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
            </div>
        )
    },

    render : function(){
        return(
            <div>
                <h2>Inventory</h2>
                {Object.keys(this.props.fishes).map(this.renderInventory )}
                <AddFishForm { ...this.props /*will take all of the props from the inventory component and pass them down to the AddFishForm*/ } />
                <button onClick={this.props.loadSamples} >Load Sample Fishes</button>
            </div>
        )
    }
})

/* 
    StorePicker
    This will let us make <StorePicker/>
*/

var StorePicker = React.createClass({
    mixins : [History],

    goToStore : function(event) {
        event.preventDefault();
        // get the data from the input
        var storeId = this.refs.storeId.value; // this = StorePicker component itself; refs = reference defined down in the text input in the return of the render function below; storeID is the name of that reference; value is vanilla JS way of getting the value from that input
        console.log(storeId)
        // transition from <StorePicker/> to <App/>
        this.history.pushState('null', '/store/' + storeId)
    },

    render : function() {   // render method shows us what HTML will be rendered on the page
        {/*This is how you write a comment with jsx*/}
        var name = "Marina"
        return(
            //always only return a single element (can have many children inside of it but must be wrapped in only one tag)
            <form className="store-selector" onSubmit={this.goToStore}>
                <h2>Please Enter A Store {name}</h2>
                <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
                <input type="submit" />
            </form>
        )
    }
});
// ^ uses jsx syntax so that you can write html syntax inside of the return
// otherwise, you'd have to do this: return React.createElement('p', {className: 'testing'}, 'content in the p tag')

/*
    Not Found
*/

var NotFound = React.createClass({
    render : function() {
        return <h1>Not found!</h1>
    }
})


/*
    Routes
*/

var routes = (
    <Router history={createBrowserHistory()/* passes in history to browser */}>
        <Route path="/" component={StorePicker}/>
        <Route path="/store/:storeId" component={App}/>
        <Route path="*" component={NotFound} />
    </Router>
)


ReactDOM.render(routes, document.querySelector("#main")); // takes two arguments: the thing you want to render and where you want to put it on the page

