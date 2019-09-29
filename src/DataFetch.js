import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "https://cors-anywhere.herokuapp.com/http://ufo-api.herokuapp.com/api/sightings/search?limit=100";

class DataFetch extends Component {
	constructor() {
    super();
 		this.state = {
            ufoData: {}
        }
    }

  componentDidMount() {
    axios.get(API_SERVER_HOST)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
    	<div>
	    </div>
    );
  }
}

export default DataFetch;

