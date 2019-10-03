import React from 'react';
import './App.css';
import DataFetch from './DataFetch';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Hello Team Post!
      </header>
      <p className="App-desc">
        Insert your own visualizations below!
      </p>
      <div className="App-content">
        <DataFetch />
      </div>
    </div>
  );
}

export default App;
