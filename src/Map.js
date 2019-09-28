  
import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';
import { select } from 'd3-selection';


class Map extends Component {
    constructor(props){
        super(props);
        this.createMap = this.createMap.bind(this);
    }

    componentDidMount() {
        this.createMap();
     }
  
    componentDidUpdate() {
        this.createMap();
    }


    render() {
        
     }
}

export default Map;