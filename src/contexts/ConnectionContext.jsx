import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

export const ConnectionContext = createContext(null);

export default function ConnectionContextProvider({ children }) {
  const socket = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [serverEvents, setServerEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function connect() {
    socket.current.connect();
    // setIsConnected(true);
  }

  function disconnect() {
    console.log("Running disconnect fcn");
    socket.current.disconnect();
    // setIsConnected(false);
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("submit fired: ", message);
    socket.current
      .timeout(50)
      .emit("message", message, () => setIsLoading(false));
    setServerEvents((prev) => [...prev, { message, id: socket.current.id }]);
    setMessage("");
  };

  useEffect(() => {
    socket.current = io("https://socket-chat-server-4qhi.onrender.com", {
      autoConnect: false,
    });

    const onConnect = () => {
      console.log(`Connected to server with socket.id ${socket.current.id}`);
      setIsConnected(true);
    };
    const onDisconnect = () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    };
    const onServerEvent = (value) => {
      console.log("running server events: ", value);
      setServerEvents((prev) => [...prev, value]);
    };

    socket.current.on("connect", onConnect);
    socket.current.on("disconnect", onDisconnect);
    socket.current.on("serverEvent", onServerEvent);

    return () => {
      socket.current.off("connect", onConnect);
      socket.current.off("disconnect", onDisconnect);
      socket.current.off("serverEvent", onServerEvent);
    };
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        socket,
        connect,
        disconnect,
        isConnected,
        setIsConnected,
        serverEvents,
        setServerEvents,
        message,
        setMessage,
        handleSendMessage,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

ConnectionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
