import React, { useState, useEffect } from 'react';
import Square from './Square';
import './Board.css';

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState([]);
  const [player, setPlayer] = useState('X'); // Assume player is 'X' initially

  useEffect(() => {
    if (!isXNext && !gameOver) {
      const bestMove = getBestMove(squares, player === 'X' ? 'O' : 'X');
      if (bestMove !== null) {
        setTimeout(() => handleClick(bestMove, false), 500);
      }
    }
  }, [isXNext, gameOver, squares, player]);

  const handleClick = (index, isPlayerMove = true) => {
    const newSquares = squares.slice();
    if (calculateWinner(squares) || squares[index] || gameOver) {
      return;
    }
    newSquares[index] = isPlayerMove ? player : (player === 'X' ? 'O' : 'X');
    setSquares(newSquares);
    setIsXNext(isPlayerMove ? false : true);
    const winner = calculateWinner(newSquares);
    if (winner || !newSquares.includes(null)) {
      setGameOver(true);
      setResults([...results, {
        winner: winner ? winner : 'Draw',
        player,
        computer: player === 'X' ? 'O' : 'X'
      }]);
    }
  };

  const renderSquare = (index) => {
    return (
      <Square
        value={squares[index]}
        onClick={() => handleClick(index)}
      />
    );
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner === player ? 'You' : 'Computer'}`;
  } else if (!squares.includes(null)) {
    status = 'Draw';
  } else {
    status = `Next player: ${isXNext ? player : (player === 'X' ? 'O' : 'X')}`;
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  };

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="button" onClick={resetGame}>Reset</button>
      {gameOver && <button className="button" onClick={resetGame}>Play Again</button>}
      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Game</th>
              <th>You</th>
              <th>Computer</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{result.winner === result.player ? 'Win' : (result.winner === 'Draw' ? 'Draw' : 'Lose')}</td>
                <td>{result.winner === result.computer ? 'Win' : (result.winner === 'Draw' ? 'Draw' : 'Lose')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getBestMove(squares, computer) {
  const player = computer === 'X' ? 'O' : 'X';
  
  function minimax(squares, depth, isMaximizing) {
    const winner = calculateWinner(squares);
    if (winner === computer) return 10 - depth;
    if (winner === player) return depth - 10;
    if (!squares.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = computer;
          const score = minimax(squares, depth + 1, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = player;
          const score = minimax(squares, depth + 1, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  let bestMove = null;
  let bestScore = -Infinity;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = computer;
      const score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

export default Board;