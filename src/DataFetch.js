  import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


const API_SERVER_HOST = process.env.REACT_APP_API_SERVER_HOST || "http://ufo-api.herokuapp.com/api/sightings/search?limit=150000";

class DataFetch extends Component {
	constructor() {
        super();
 		this.state = {
            ufoData: {}
        }
    }

  componentDidMount() {
  	const data = axios.all([
		    axios.get(API_SERVER_HOST)
          ]);
          
          this.setState({ ufoData: data });
  }

  render() {
    return (
    	<div>
	    </div>
    );
  }
}

export default DataFetch;

