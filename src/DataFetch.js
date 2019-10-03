import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Map from './Map';

const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "https://cors-anywhere.herokuapp.com/http://ufo-api.herokuapp.com/api/sightings/search?limit=1000";

class DataFetch extends Component {
	constructor() {
    super();
 		this.state = {
            ufoData: []
        }
    }

  componentDidMount() {
    var that = this;
    axios.get(API_SERVER_HOST)
      .then(function (response) {
        console.log(response.data.sightings);
        that.setState({ ufoData: response.data.sightings });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
    	<div>
        <Map />
	    </div>
    );
  }
}

export default DataFetch;

