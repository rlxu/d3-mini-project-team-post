import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Map from './Map';
import StreamChart from './StreamChart';
import WordFrequency from './WordFrequency';


const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "https://cors-anywhere.herokuapp.com/http://ufo-api.herokuapp.com/api/sightings/search?limit=100";

class DataFetch extends Component {
	constructor() {
    super();
 		this.state = {
            ufoData: []
        }
    }

  componentDidMount() {
    var that = this
    axios.get(API_SERVER_HOST)
      .then(function (response) {
        that.setState( {ufoData: response.data.sightings} )
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
      // console.log(this.state.ufoData)
      return (
          <div>
            <StreamChart data={this.state.ufoData}/>
            <WordFrequency data={this.state.ufoData}/>
            <Map data={this.state.ufoData}/>
          </div>
      );
  }
}

export default DataFetch;

