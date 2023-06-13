import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function Rooms() {
  const { user } = useContext(AuthContext);
  const {
    currentRoom,
    setCurrentRoom,
    joinRoom,
    leaveRoom,
    loginRoom,
    currAddedRooms,
  } = useContext(ConnectionContext);
  const roomInputRef = useRef(null);
  console.log("user: ", user);
  const [allRooms, setAllRooms] = useState([]);

  useEffect(() => {
    if (!user || !user.hasOwnProperty("rooms")) return;
    setAllRooms([...user.rooms, ...currAddedRooms]);
  }, [currAddedRooms, user]);

  return (
    user && (
      <aside className="col-start-1 col-end-2 max-h-[75vh] mt-32 border-2 border-l-0 border-slate-200 flex flex-col rounded-tr rounded-br items-center">
        <h2 className="text-slate-200 text-xl  ">Rooms</h2>
        <form className="flex w-full" onSubmit={joinRoom}>
          <button
            type="submit"
            className="w-1/3 py-3 border-2 border-l border-r-0 border-slate-200 bg-slate-400 hover:bg-slate-300"
          >
            Join
          </button>
          <input
            className="w-2/3 text-center"
            type="text"
            name="room-input"
            id="room-input"
            ref={roomInputRef}
            value={currentRoom}
            onChange={(e) => setCurrentRoom(e.target.value)}
            placeholder="Enter RoomName..."
          />
        </form>
        <button
          onClick={leaveRoom}
          className="w-full py-3 border-2 border-l-0 border-r border-slate-200 bg-slate-400 hover:bg-slate-300"
        >
          Leave
        </button>
        <nav className=" w-full">
          <ul className=" overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-cyan-950 [&::-webkit-scrollbar-track]:rounded-r-lg [&::-webkit-scrollbar-thumb]:bg-cyan-600 [&::-webkit-scrollbar-thumb]:rounded-r-lg">
            {allRooms.length > 0 &&
              allRooms.map((room) => (
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
