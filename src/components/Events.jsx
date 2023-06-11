import { useContext } from "react";
import { ConnectionContext } from "../contexts/ConnectionContext";
import { AuthContext } from "../contexts/AuthContext";

export function Events() {
  const { serverEvents } = useContext(ConnectionContext);
  const { user } = useContext(AuthContext);

  return (
    <ul className="w-9/12 h-1/3 overflow-y-auto bg-cyan-700 rounded-lg border-px border-indigo-950 min-h-[4rem] my-2 mx-auto flex flex-col items-start [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-cyan-950 [&::-webkit-scrollbar-track]:rounded-r-lg [&::-webkit-scrollbar-thumb]:bg-cyan-600 [&::-webkit-scrollbar-thumb]:rounded-r-lg">
      {user &&
        serverEvents.map((event, index) => (
          <li
            key={index}
            className={`${event.username === user.username ? "self-end" : ""}`}
          >
            <div
              className={`px-4 py-2 block rounded-lg  ${
                event.username === user.username
                  ? "self-end bg-cyan-400"
                  : "bg-cyan-500"
              }`}
            >
              {event.message}
            </div>
            <p
              className={`text-sm mx-2 ${
                event.username === serverEvents[index + 1]?.username
                  ? "hidden"
                  : ""
              } ${
                event.username === user.username ? "text-right" : "text-left"
              }`}
            >
              {event.username}: {new Date(event.time).toLocaleTimeString()}
            </p>
          </li>
        ))}
    </ul>
  );
}
