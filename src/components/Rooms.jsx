import { useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function Rooms() {
  const { user } = useContext(AuthContext);
  const { currentRoom, setCurrentRoom, joinRoom, leaveRoom } =
    useContext(ConnectionContext);
  const roomInputRef = useRef(null);
  return (
    user && (
      <aside className="col-start-1 col-end-2 max-h-[75vh] mt-32 border-2 border-l-0 border-slate-200 flex flex-col rounded-tr rounded-br items-center">
        <h2 className="text-slate-200 text-xl  ">Rooms</h2>
        <div className="flex w-full">
          <button
            onClick={leaveRoom}
            className="w-1/2 py-3 border-2 border-l-0 border-r border-slate-200 bg-slate-400 hover:bg-slate-300"
          >
            Leave
          </button>
          <button
            onClick={joinRoom}
            className="w-1/2 py-3 border-2 border-l border-r-0 border-slate-200 bg-slate-400 hover:bg-slate-300"
          >
            Join
          </button>
        </div>
        <input
          className="w-full text-center"
          type="text"
          name="room-input"
          id="room-input"
          ref={roomInputRef}
          value={currentRoom}
          onChange={(e) => setCurrentRoom(e.target.value)}
          placeholder="Enter RoomName..."
        />
        <nav className="overflow-y-auto"></nav>
      </aside>
    )
  );
}
