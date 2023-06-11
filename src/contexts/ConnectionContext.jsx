import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";

export const ConnectionContext = createContext(null);

export default function ConnectionContextProvider({ children }) {
  const { user, removeUser, getUserRooms, triggerLogin, setTriggerLogin } =
    useContext(AuthContext);

  const socket = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [serverEvents, setServerEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentRoom, setCurrentRoom] = useState("");
  const [visitedRoom, setVisitedRoom] = useState("");

  function connect() {
    if (!user) return;
    socket.current.connect();
    setIsConnected(true);
  }

  function disconnect() {
    if (!user) return;
    removeUser();
    console.log("Running disconnect fcn");
    socket.current.disconnect();
    setIsConnected(false);
  }

  const handleSendMessage = (e) => {
    const time = new Date();
    e.preventDefault();
    setIsLoading(true);
    console.log("submit fired: ", message);
    console.log("to room: ", currentRoom);
    socket.current.emit("message", message, time, currentRoom, () =>
      setIsLoading(false)
    );
    setServerEvents((prev) => [
      ...prev,
      { message, username: user.username, time },
    ]);
    setMessage("");
  };

  const joinRoom = () => {
    if (!currentRoom) return;
    socket.current.emit("join-room", currentRoom, (callback) => {
      console.log("callback from socket: ", callback);
      setServerEvents(callback.messages ?? []);
      setVisitedRoom(callback.roomName);
    });
  };

  const loginRoom = (room) => {
    socket.current.emit("join-room", room, (callback) => {
      setServerEvents(callback.messages ?? []);
      setVisitedRoom(callback.roomName);
      setCurrentRoom(callback.roomName);
    });
  };

  const leaveRoom = () => {
    if (!currentRoom && !visitedRoom) return;
    socket.current.emit("leave-room", currentRoom);
    setServerEvents([]);
    setCurrentRoom("");
    setVisitedRoom("");
  };

  const onConnect = () => {
    console.log(`Connected to server with socket.id ${socket.current.id}`);
    console.log(socket.current);
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

  socket.current?.on("get-user-rooms", getUserRooms);

  useEffect(() => {
    if (!triggerLogin) return;
    if (!user) return setServerEvents([]);
    socket.current = io("http://localhost:5555", {
      //http://localhost:5555
      autoConnect: false,
      auth: {
        token: `Bearer ${user.token}`,
      },
      transports: ["websocket"],
    });

    socket.current.on("connection", onConnect);
    socket.current.on("disconnect", onDisconnect);
    socket.current.on("receiveMessages", onServerEvent);

    socket.current.connect();
    setTriggerLogin(false);
    console.log(socket.current);

    return () => {
      socket.current.off("connection", onConnect);
      socket.current.off("disconnect", onDisconnect);
      socket.current.off("serverEvent", onServerEvent);
      socket.current.off("get-user-rooms", getUserRooms);
    };
  }, [triggerLogin]);

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
        currentRoom,
        setCurrentRoom,
        joinRoom,
        visitedRoom,
        leaveRoom,
        loginRoom,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

ConnectionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
