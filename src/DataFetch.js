import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import StreamChart from './StreamChart';


const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "https://cors-anywhere.herokuapp.com/http://ufo-api.herokuapp.com/api/sightings/search?limit=20000";

class DataFetch extends Component {
	constructor() {
    super();
 		this.state = {
            ufoData: {}
        }
    }

  componentDidMount() {
    var referenceToOriginalThis = this
    axios.get(API_SERVER_HOST)
      .then(function (response) {
        referenceToOriginalThis.setState( {ufoData: response.data.sightings} )
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
      // console.log(this.state.ufoData)
      return (
    	    <div>
            <StreamChart data={this.state.ufoData} />
	        </div>
      );
  }
}

export default DataFetch;

