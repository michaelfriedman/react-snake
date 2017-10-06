import React, { Component } from 'react';
import './App.css';

const GRID_SIZE = 35;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i += 1) {
  GRID.push(i);
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid />
      </div>
    );
  }
}

export default App;
