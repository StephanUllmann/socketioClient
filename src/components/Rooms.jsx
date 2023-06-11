import { useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function Rooms() {
  const { user } = useContext(AuthContext);
  const { currentRoom, setCurrentRoom, joinRoom, leaveRoom, loginRoom } =
    useContext(ConnectionContext);
  const roomInputRef = useRef(null);
  console.log("user: ", user);
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
        <nav className=" w-full">
          <ul className=" overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-cyan-950 [&::-webkit-scrollbar-track]:rounded-r-lg [&::-webkit-scrollbar-thumb]:bg-cyan-600 [&::-webkit-scrollbar-thumb]:rounded-r-lg">
            {user.rooms?.length > 0 &&
              user.rooms.map((room) => (
                <li
                  key={room + user.username}
                  className="text-slate-200 text-lg bg-cyan-600 w-full text-center py-4 my-1 hover:bg-cyan-700 hover:text-slate-100 cursor-pointer"
                  onClick={() => {
                    loginRoom(room);
                  }}
                >
                  {room}
                </li>
              ))}
          </ul>
        </nav>
      </aside>
    )
  );
}
