/*
    Inventory
    <Inventory/>
*/

import React from 'react';
import AddFishForm from './AddFishForm'
import autobind from 'autobind-decorator'; 

@autobind
class Inventory extends React.Component {
    renderInventory(key){
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
    }

    render(){
        return(
            <div>
                <h2>Inventory</h2>
                {Object.keys(this.props.fishes).map(this.renderInventory )}
                <AddFishForm { ...this.props /*will take all of the props from the inventory component and pass them down to the AddFishForm*/ } />
                <button onClick={this.props.loadSamples} >Load Sample Fishes</button>
            </div>
        )
    }
};

Inventory.propTypes = {
        linkState : React.PropTypes.func.isRequired,
        removeFish : React.PropTypes.func.isRequired,
        loadSamples : React.PropTypes.func.isRequired,
        addFish : React.PropTypes.func.isRequired,
        fishes : React.PropTypes.object.isRequired
}

export default Inventory;