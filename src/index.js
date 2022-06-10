// https://reactjs.org/tutorial/tutorial.html
// continue from "Showing the Past Moves"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// added "type": "module", inside package.json file to fix "SyntaxError: Cannot use import statement outside a module"

function Square(props) {
  return (
    <button className="square"
      onClick={() => {props.onClick(); console.log("Clicked a square")}}
      // ^ two functions for each time the square is clicked, a print and Board on click handler
    >
      {props.data}
      {/* Displays data in square*/}
    </button>
    // ^ cannot comment in these tags
//       onClick={function() { console.log('click'); }}>
//       onClick={function() {console.log('click'); means
//       onClick={() => console.log('click')};
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square data={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }


  render() {
    let renderSquares = [];
    for (let row = 0; row < 3; row++) {
      let squaresRow = [];
      for (let column = 0; column < 3; column++) {
        squaresRow.push(<span key={column + row*3}>{this.renderSquare(column + row*3)}</span>);
      }
      renderSquares.push(<div className="board-row" key={row}>{squaresRow}</div>);
    };
    console.log("renderSquares:" + renderSquares[0]);
    return (
      <div>
        {renderSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      // For syntax, can have extra comma or no last comma
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    // makes shallow copy of squares
    console.log("CLicked square " + i);
    if (squares[i] !== null || calculateWinner(squares) !== null) {
      return;
    }
    // ignore clicks on already taken squares
    // ignore clicks on games where a winner was already declared
    squares[i] = this.state.xIsNext ? 'X': 'O';
    // edits const squares?
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
    // updates squares, xIsNext, and stepNumber
    // this.setState({
    //   stepNumber: this.stepNumber + 1,
    // });
    // this.stepNumber = this.stepNumber + 1
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    
    let x = current.squares;
    const winner = calculateWinner(x);

    function findDifference(current, previous) {
      if (previous === undefined) {
        return -1;
      }
      for (let i = 0; i < 9; i++) {
        if (current.squares[i] !== previous.squares[i]) {
          return i;
        }
      }
    }

    // let desc = 'Go to game start';
    // // can use move as key since it is unique (move is an index)
    // <li key ={0}>
    //   <button onClick={() => this.jumpTo(0)}>{desc}</button>
    // </li>
    // ;
    // for (let i = 1; i < history.length; i++) {
    //   const result = findDifference(i);
    //   const desc = 'Go to move #' + i + ": " + ((i % 2) ? "X": "O") + " at " + 0;
    //   <li key ={i}>
    //     <button onClick={() => this.jumpTo(i)}>{desc}</button>
    //   </li>
    // }

    const moves = history.map((step, move) => {
    //   // console.log("step:", step);
    //   // console.log("move:", move);
      const temp = findDifference(step, this.state.history[move - 1]);
      const x = temp % 3;   // math to get column
      const y = Math.floor(temp / 3);   // math to get row
      const desc = move ?
      'Go to move #' + move + ": " + ((move % 2) ? "X": "O") + " at (" + x + ", " + y + ")":    // print move with (column, row)
      'Go to game start';
      if (move === this.state.stepNumber) {   // <b></b> bolds text which it only does for stepNumber which is currently selected move
        return (
          // can use move as key since it is unique (move is an index)
          <li key ={move}>
            <button onClick={() => this.jumpTo(move)}>{<b>{desc.fontcolor("blue")}</b>}</button>
          </li>
        );
      } else {
        return (
          <li key ={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );  
      }
    });
    let status;
    let remainingSpace = false;
    if (winner !== null) {
      status = 'Winner: ' + winner;
    } else {
      for (let i = 0; i < current.squares.length; i++) {
        if (current.squares[i] === null) {
          remainingSpace = true
          break;
        }
      }
      if (remainingSpace) {
        status = "Next Player: " + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = "Tie Game"; 
      }
    }
    // added a "Tie Game" end screen
    let reverseMoves = false;
    let currentMoves = moves;
    if (reverseMoves) {
      currentMoves = currentMoves.reverse();
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{currentMoves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] !== null && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
