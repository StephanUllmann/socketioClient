import { useContext } from "react";
import { ConnectionContext } from "../contexts/ConnectionContext";

export default function SendMessage() {
  const { setMessage, handleSendMessage, message } =
    useContext(ConnectionContext);
  return (
    <div className="w-9/12 mx-auto">
      <form
        className="w-full flex gap-4"
        onSubmit={(e) => handleSendMessage(e)}
      >
        <input
          className="grow bg-cyan-700 focus:bg-cyan-700 border-cyan-900 border-2 rounded-lg cursor-text  text-slate-400 focus:text-slate-50 py-3 px-6 placeholder:text-stone-300"
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder={`Type here...`}
          // disabled={!isConnected}
        />
        <button
          className="bg-cyan-700 border-cyan-900 border-2 rounded-lg hover:bg-cyan-800 cursor-pointer text-slate-400 py-3 px-6 disabled:cursor-not-allowed"
          type="submit"
          // disabled={isLoading || !isConnected}
        >
          Send
        </button>
      </form>
    </div>
  );
}
