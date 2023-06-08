import { useContext } from "react";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function SendMessage() {
  const { setMessage, handleSendMessage, message, isLoading } =
    useContext(ConnectionContext);
  return (
    <div>
      <form className="flex gap-4" onSubmit={(e) => handleSendMessage(e)}>
        <input
          className="w-96 bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Type here..."
        />
        <button
          className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6"
          type="submit"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
