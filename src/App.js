import React from 'react';

//importing the css file called game2 which is in components folder.
import './components/game2.css';
import ReactDOM from 'react-dom';
import './App.css';
export


//here we are considering each square(9 squares) properties.
//it returns the value when each time the button(square) is clicked.
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


//we consider the whole board her which consists of 9 squares all together.
class Board extends React.Component {

  //9 squares are rendered here.
  //the value and onclick event is returned.
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }


  //here we consider all the 9 squares to render.
  render() {
    return (
      //each row (3 squares in a row) taken as an array is rendered each time.
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


//since we can't take more than 1 class as default, this class called Game is taken as default.
export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //to keep the history of the moves done when the squares are filled.
      //firstly it will be null.
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      //step number is initialized to 0 here.
      stepNumber: 0,
      xIsNext: true
    };
  }


  //when each time it is clicked, 
  //beginning is X and in the temporary board(a board copied from original board where game is actually played),
  handleClick(i) {
    //3 constant variables are considered.
    //slice method is used here because to create a copy a the square array.
    //initially it is 0(first square).
    //when we enter each time, the step number shoul be incremented 
    const history = this.state.history.slice(0, this.state.stepNumber + 1); 
    //history is put into the current now.
    //history becomes null.
    //current has 8 (9-1) boxes now, since we entered one element(that is why decrementation is done here).
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    //to calculate the winner of squares, if squares becomes True, 
    //squares[i] means 8, that is either horizontally,vertically,diagonally we get XXX then X is the winner.
    if (calculateWinner(squares) || squares[i]) {
      //it returns winner when True.
      return;
    }
    //else it goes to next state.
    //either X or O should be entered.
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      //every time the history is concatenated with the older history(that is updated everytime)
      history: history.concat([
        {
          squares: squares
        }
      ]),
      //history length is put to step number;that is how many times can you take move is been seen.
      stepNumber: history.length,
      //if X is not first, that is O;  
      xIsNext: !this.state.xIsNext
    });
  }
//it jumps to next step.
  jumpTo(step) {
    this.setState({
      //it shows which should take next move; step % 2 is equal to 0, it should be true.
      stepNumber: step,
      xIsNext: (step % 2) === 0
      //it decides who should take next move.
    });
  }


  //this is for storing the history in the backend.
  //no one can change this; step number is stored in current, and winner of the game each time is also stored.
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    //displays if it is a winner
    if (winner) {
      status = "Winner: " + winner;
    } else {
      //else shows up to do next move
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

//this is calculating the winner by seeing the array elements in a row
function calculateWinner(squares) {
  const lines = [
    //deciding winner according to the places filled vertically,horizontally,diagonally same elements(X or O)
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
