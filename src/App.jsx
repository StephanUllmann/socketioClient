import ConnectionManager from "./components/ConnectionManager";
import { Events } from "./components/Events";
import SendMessage from "./components/SendMessage";

function App() {
  return (
    <main className="min-h-screen bg-cyan-900">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-slate-200 text-4xl p-10 ">Little Messenger</h1>
        <Events />
        <div className="flex justify-between w-9/12 mx-auto">
          <ConnectionManager />
          <SendMessage />
        </div>
      </div>
    </main>
  );
}

export default App;
