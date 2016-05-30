/* 
    StorePicker
    This will let us make <StorePicker/>
*/

import React from 'react';
import { History } from 'react-router';
import h from '../helpers';
import react-mixin from 'react-mixin';

class StorePicker extends React.Component {

    goToStore(event) {
        event.preventDefault();
        // get the data from the input
        var storeId = this.refs.storeId.value; // this = StorePicker component itself; refs = reference defined down in the text input in the return of the render function below; storeID is the name of that reference; value is vanilla JS way of getting the value from that input
        console.log(storeId)
        // transition from <StorePicker/> to <App/>
        this.history.pushState('null', '/store/' + storeId)
    }

    render() {   // render method shows us what HTML will be rendered on the page
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
};
// ^ uses jsx syntax so that you can write html syntax inside of the return
// otherwise, you'd have to do this: return React.createElement('p', {className: 'testing'}, 'content in the p tag')

reactMixin.onClass(StorePicker, History);

export default StorePicker;