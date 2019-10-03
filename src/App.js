import React from 'react';
import './App.css';
import DataFetch from './DataFetch';

function App() {
  return (
    <div className="App">
      <div></div>
      <h1 className="App-header">
        UFO 👽 SIGHTINGS: DATA VISUALIZATION
      </h1>
      <div className="App-content">
        <DataFetch />
      </div>
    </div>
  );
}

export default App;
