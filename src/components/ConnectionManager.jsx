import { useContext } from "react";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function ConnectionManager() {
  const { connect, disconnect } = useContext(ConnectionContext);
  return (
    <div className="flex gap-4">
      <button
        className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
        onClick={disconnect}
      >
        Disconnect
      </button>

      <button
        className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
        onClick={connect}
      >
        Connect
      </button>
    </div>
  );
}
