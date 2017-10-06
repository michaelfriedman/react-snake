import React, { Component } from 'react';
import cs from 'classnames';
import './App.css';

const GRID_SIZE = 35;
const GRID = [];

for (let i = 0; i <= GRID_SIZE; i += 1) {
  GRID.push(i);
}

const isBorder = (x, y) =>
  x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE;

const getCellCs = (x, y, snake, snack) =>
  cs('grid-cell', {
    'grid-cell-border': isBorder(x, y),
    'grid-cell-snake': x === snake.coordinate.x && y === snake.coordinate.y,
    'grid-cell-snack': x === snack.coordinate.x && y === snack.coordinate.y,
  });

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snake: {
        coordinate: {
          x: 20,
          y: 10,
        },
      },
      snack: {
        coordinate: {
          x: 25,
          y: 10,
        },
      },
    };
  }
  render() {
    const { snake, snack } = this.state;
    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid snake={snake} snack={snack} />
      </div>
    );
  }
}

const Grid = ({ snake, snack }) => (
  <div>{GRID.map(y => <Row y={y} key={y} snake={snake} snack={snack} />)}</div>
);

const Row = ({ y, snake, snack }) => (
  <div className="grid-row">
    {GRID.map(x => <Cell x={x} y={y} key={x} snake={snake} snack={snack} />)}
  </div>
);

const Cell = ({ x, y, snake, snack }) => (
  <div className={getCellCs(x, y, snake, snack)} />
);
