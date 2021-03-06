import React, { Component } from 'react';
import cs from 'classnames';
import './App.css';

const GRID_SIZE = 35;
const GRID = [];
const TICK_RATE = 200;

const DIRECTIONS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
};

const KEY_CODES_MAPPER = {
  38: 'UP',
  39: 'RIGHT',
  37: 'LEFT',
  40: 'DOWN',
};

const getRandomCoordinate = () => ({
  x: getRandomFromRange(1, GRID_SIZE - 1),
  y: getRandomFromRange(1, GRID_SIZE - 1),
});

const getRandomFromRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const DIRECTION_TICKS = {
  UP: (x, y) => ({ x, y: y - 1 }),
  DOWN: (x, y) => ({ x, y: y + 1 }),
  LEFT: (x, y) => ({ x: x - 1, y }),
  RIGHT: (x, y) => ({ x: x + 1, y }),
};

for (let i = 0; i <= GRID_SIZE; i += 1) {
  GRID.push(i);
}

const isBorder = (x, y) =>
  x === 0 || y === 0 || x === GRID_SIZE || y === GRID_SIZE;

const isPosition = (x, y, diffX, diffY) => x === diffX && y === diffY;

const isSnake = (x, y, snakeCoordinates) =>
  snakeCoordinates.filter(c => isPosition(c.x, c.y, x, y)).length;

const getSnakeHead = snake => snake.coordinates[0];

const getSnakeWithoutStub = snake =>
  snake.coordinates.slice(0, snake.coordinates.length - 1);

const getIsSnakeEating = ({ snake, snack }) =>
  isPosition(
    getSnakeHead(snake).x,
    getSnakeHead(snake).y,
    snack.coordinate.x,
    snack.coordinate.y,
  );

const getIsSnakeOutside = snake =>
  getSnakeHead(snake).x >= GRID_SIZE ||
  getSnakeHead(snake).y >= GRID_SIZE ||
  getSnakeHead(snake).x <= 0 ||
  getSnakeHead(snake).y <= 0;

const getIsSnakeClumsy = snake =>
  isSnake(getSnakeHead(snake).x, getSnakeHead(snake).y, getSnakeTail(snake));

const getSnakeTail = snake => snake.coordinates.slice(1);

const getCellCs = (isGameOver, x, y, snake, snack) =>
  cs('grid-cell', {
    'grid-cell-border': isBorder(x, y),
    'grid-cell-snake': isSnake(x, y, snake.coordinates),
    'grid-cell-snack': isPosition(x, y, snack.coordinate.x, snack.coordinate.y),
    'grid-cell-hit':
      isGameOver &&
      isPosition(x, y, getSnakeHead(snake).x, getSnakeHead(snake).y),
  });

const applyGameOver = prevState => ({
  playground: {
    isGameOver: true,
  },
});

const applySnakePosition = prevState => {
  const isSnakeEating = getIsSnakeEating(prevState);

  const snakeHead = DIRECTION_TICKS[prevState.playground.direction](
    getSnakeHead(prevState.snake).x,
    getSnakeHead(prevState.snake).y,
  );

  const snakeTail = isSnakeEating
    ? prevState.snake.coordinates
    : getSnakeWithoutStub(prevState.snake);

  const snackCoordinate = isSnakeEating
    ? getRandomCoordinate()
    : prevState.snack.coordinate;

  return {
    snake: {
      coordinates: [snakeHead, ...snakeTail],
    },
    snack: {
      coordinate: snackCoordinate,
    },
  };
};

const doChangeDirection = direction => () => ({ playground: { direction } });

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playground: {
        direction: DIRECTIONS.RIGHT,
        isGameOver: false,
      },
      snake: {
        coordinates: [getRandomCoordinate()],
      },
      snack: {
        coordinate: getRandomCoordinate(),
      },
    };
  }
  componentDidMount() {
    this.interval = setInterval(this.onTick, TICK_RATE);

    window.addEventListener('keyup', this.onChangeDirection, false);
  }
  componentWillUnmount() {
    clearInterval(this.interval);

    window.removeEventListener('keyup', this.onChangeDirection, false);
  }
  onTick = () => {
    const { snake } = this.state;

    getIsSnakeOutside(snake) || getIsSnakeClumsy(snake)
      ? this.setState(applyGameOver)
      : this.setState(applySnakePosition);
  };
  onChangeDirection = ({ keyCode }) => {
    const direction = KEY_CODES_MAPPER[keyCode];
    if (direction) {
      this.setState(doChangeDirection(direction));
    }
  };
  render() {
    const { snake, snack, playground } = this.state;

    return (
      <div className="app">
        <h1>Snake!</h1>
        <Grid isGameOver={playground.isGameOver} snake={snake} snack={snack} />
      </div>
    );
  }
}

const Grid = ({ isGameOver, snake, snack }) => (
  <div>
    {GRID.map(y => (
      <Row isGameOver={isGameOver} y={y} key={y} snake={snake} snack={snack} />
    ))}
  </div>
);

const Row = ({ isGameOver, y, snake, snack }) => (
  <div className="grid-row">
    {GRID.map(x => (
      <Cell
        isGameOver={isGameOver}
        x={x}
        y={y}
        key={x}
        snake={snake}
        snack={snack}
      />
    ))}
  </div>
);

const Cell = ({ isGameOver, x, y, snake, snack }) => (
  <div className={getCellCs(isGameOver, x, y, snake, snack)} />
);
