import { useContext } from "react";
import { ConnectionContext } from "../contexts/ConnectionContext";

export function Events() {
  const { serverEvents, socket } = useContext(ConnectionContext);
  return (
    <ul className="w-9/12 bg-cyan-700 rounded-lg border-px border-indigo-950 min-h-[4rem] my-2 mx-auto flex flex-col items-start">
      {serverEvents.map((event, index) => (
        <li
          className={`bg-cyan-400 px-4 py-2 block rounded-lg  ${
            socket.current.id === event.id ? "" : "self-end"
          }`}
          key={index}
        >
          {event.message}
        </li>
      ))}
    </ul>
  );
}
