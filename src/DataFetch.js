  import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import StreamChart from './StreamChart';

const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "http://ufo-api.herokuapp.com/api/sightings/search?limit=100";

class DataFetch extends Component {
	constructor() {
      super();
 		  this.state = {
          ufoData: {}
      }
  }

  componentDidMount() {
      axios.get(API_SERVER_HOST)
      .then(function(response){
        console.log("Made it here");
        console.log(response)
        //this.setState({ ufoData: response })
      });
  }

  render() {
      return (
    	    <div>
            {/* <StreamChart data={this.state.ufoData} /> */}
	        </div>
      );
  }
}

export default DataFetch;

