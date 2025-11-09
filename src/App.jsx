import { useState, useEffect } from "react";
import Player from "./components/Player/Player.jsx";
import GameBoard from "./components/GameBoard/GameBoard.jsx";
import GameOver from "./components/GameOver/GameOver.jsx";
import Log from "./components/Log/Log.jsx";
import { deriveWinner, deriveActivePlayer, deriveGameBoard } from "./utils";
import "./index.css";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(isDarkMode ? "dark-mode" : "light-mode");
  }, [isDarkMode]);

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handleClearNames() {
    setPlayers({
      X: "Player 1",
      O: "Player 2",
    });
  }

  return (
    <>
      <main>
        <div id="theme-toggle-container">
          <button
            id="theme-toggle"
            onClick={() => setIsDarkMode((prev) => !prev)}
          >
            {isDarkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>
        </div>

        <div id="game-container">
          <ol id="players" className="highlight-player">
            <Player
              initialName={players.X}
              symbol="X"
              isActive={activePlayer === "X"}
              onChangeName={handlePlayerNameChange}
            />
            <Player
              initialName={players.O}
              symbol="O"
              isActive={activePlayer === "O"}
              onChangeName={handlePlayerNameChange}
            />
          </ol>

          <div id="clear-container">
            <button id="clear-names" onClick={handleClearNames}>
              Clear Names
            </button>
          </div>

          {(winner || hasDraw) && (
            <GameOver winner={winner} onRestart={handleRestart} />
          )}

          <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />

          <Log turns={gameTurns} />
        </div>
      </main>
    </>
  );
}
