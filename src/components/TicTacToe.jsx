import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function TicTacToe() {
  const { user } = useContext(AuthContext);
  const {
    activePlayer,
    setActivePlayer,
    playerOneFields,
    setPlayerOneFields,
    playerTwoFields,
    winner,
    resetGame,
    opponentName,
  } = useContext(ConnectionContext);
  const fields = [
    "1-1",
    "1-2",
    "1-3",
    "2-1",
    "2-2",
    "2-3",
    "3-1",
    "3-2",
    "3-3",
  ];

  const addToActivePlayer = (field) => {
    if ([...playerOneFields, ...playerTwoFields].includes(field) || winner)
      return;
    if (activePlayer === 1) {
      setPlayerOneFields((prev) => [...prev, field]);
      setActivePlayer(2);
    }
    if (activePlayer === 2) return;
    // if (activePlayer === 2) {
    //   setPlayerTwoFields((prev) => [...prev, field]);
    // }
  };

  useEffect(() => {}, [playerOneFields, playerTwoFields]);

  console.log("Player1: ", playerOneFields);
  console.log("Player2: ", playerTwoFields);
  console.log("activePlayer: ", activePlayer);
  return (
    <div className="mx-auto my-6">
      <div>
        <span
          className={`text-cyan-300 text-lg my-2 mx-3 ${
            activePlayer === 1 && "underline"
          } ${
            winner && winner === 1 ? "text-orange-400 text-2xl" : "text-base"
          } transition-all duration-200`}
        >
          {user.username}
        </span>
        <span
          className={`text-teal-300 text-lg my-2 mx-3 ${
            activePlayer === 2 && "underline"
          } ${
            winner && winner === 2 ? "text-orange-400 text-2xl" : "text-base"
          } transition-all duration-200`}
        >
          {opponentName.length > 0 ? opponentName : "Player2"}
        </span>
      </div>
      <div className=" mx-auto my-5 grid grid-cols-3 gap-1 bg-cyan-950 border-4 border-cyan-950 rounded-lg overflow-hidden max-w-fit self-center">
        {fields.map((field) => (
          <div
            key={field}
            className={`w-12 aspect-square bg-cyan-700 cursor-pointer ${
              activePlayer === 1 ? "hover:bg-cyan-600" : "cursor-wait"
            }
            ${
              playerOneFields.includes(field) &&
              "bg-cyan-900 hover:bg-cyan-900 cursor-auto"
            } 
            ${
              playerTwoFields.includes(field) &&
              "bg-teal-900 hover:bg-teal-900 cursor-auto"
            }`}
            onClick={() => {
              if (activePlayer !== 1) return;
              addToActivePlayer(field);
            }}
          ></div>
        ))}
      </div>

      <button
        className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
        onClick={resetGame}
      >
        Reset
      </button>
    </div>
  );
}
