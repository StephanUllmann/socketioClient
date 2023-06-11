// import ConnectionManager from "./components/ConnectionManager";
import { useContext } from "react";
import { Events } from "./components/Events";
import Modal from "./components/Modal";
import SendMessage from "./components/SendMessage";
import Rooms from "./components/Rooms";
import { ConnectionContext } from "./contexts/ConnectionContext";
import { AuthContext } from "./contexts/AuthContext";
import TicTacToe from "./components/TicTacToe";

function App() {
  const { visitedRoom } = useContext(ConnectionContext);
  const { user } = useContext(AuthContext);
  return (
    <main className="min-h-screen bg-cyan-900 grid grid-cols-5">
      <Rooms />
      <div className=" col-start-2 col-end-6 text-center">
        <div className="flex justify-around items-baseline">
          <h1 className="text-slate-200 text-4xl p-10 ">
            {visitedRoom || "Little Messenger"}
          </h1>
          <Modal />
        </div>

        <Events />
        <div className="flex justify-between w-9/12 mx-auto">
          {/* <ConnectionManager /> */}
          <SendMessage />
        </div>
        {user && visitedRoom === "TicTacToe" && <TicTacToe />}
      </div>
    </main>
  );
}

export default App;
