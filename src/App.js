import React from 'react';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <div className="game-container">
        <Board />
      </div>
    </div>
  );
}

export default App;
