import { LightningElement, track } from 'lwc';

export default class CreateAssetList extends LightningElement {
    id = 1;
    @track properties = [this.id];
    @track propertyDataTypes; //properties starting with data are reserved

    // Fires when this component is inserted into the DOM
    connectedCallback() {
        fetch("https://my-conservation-life.herokuapp.com/getDataTypes",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            const dataTypeList = [];
            for (let type of data) {
                dataTypeList.push(type.name);
            }

            // Must stringify because LWC must use primitives, no support for lists/objects
            this.propertyDataTypes = JSON.stringify(dataTypeList);
        });
    }

    // Takes advantage of template's for:each by appending new createAssetProperty per value in list
    addCustomProperty() {
        this.id++;
        this.properties.push(this.id);
    }
}