import React from 'react';
import './Square.css';

// Square component representing a single square on the Tic Tac Toe board
function Square({ value, onClick }) {
    return (
        // Button for the square, which triggers the onClick function when clicked
        <button className="square" onClick={onClick}>
            {value} {/* Displays the value of the square ('X', 'O', or null) */}
        </button>
    );
}

export default Square; // Exporting the Square component as the default export
