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

  //////////////////////////////////////
  // TicTacToe
  const [activePlayer, setActivePlayer] = useState(null);
  const [playerOneFields, setPlayerOneFields] = useState([]);
  const [playerTwoFields, setPlayerTwoFields] = useState([]);
  const [winner, setWinner] = useState(null);
  const [opponentName, setOpponentName] = useState("");

  const checkWin = () => {
    const playerArr = activePlayer === 1 ? playerTwoFields : playerOneFields;

    const vertical = playerArr.reduce((count, field) => {
      return (
        count[field.split("-")[0]]
          ? ++count[field.split("-")[0]]
          : (count[field.split("-")[0]] = 1),
        count
      );
    }, {});

    const verticalWin =
      playerArr.length >= 3 && Object.values(vertical).some((val) => val === 3);

    const horizontal = playerArr.reduce((count, field) => {
      return (
        count[field.split("-")[1]]
          ? ++count[field.split("-")[1]]
          : (count[field.split("-")[1]] = 1),
        count
      );
    }, {});

    const horizontalWin =
      playerArr.length >= 3 &&
      Object.values(horizontal).some((val) => val === 3);

    const diagonalDown = ["1-1", "2-2", "3-3"].every((field) =>
      playerArr.includes(field)
    );
    const diagonalUp = ["3-1", "2-2", "1-3"].every((field) =>
      playerArr.includes(field)
    );
    // console.log("checking winner...");
    if (verticalWin || horizontalWin || diagonalDown || diagonalUp)
      setWinner(activePlayer === 1 ? 2 : 1);
  };

  useEffect(() => {
    checkWin();
  }, [activePlayer]);

  const resetGame = () => {
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
    setPlayerOneFields([]);
    setPlayerTwoFields([]);
    setWinner(null);
  };

  useEffect(() => {
    socket.current?.emit("tttPlayerMove", playerOneFields);
  }, [playerOneFields]);

  const getTTTStart = (num, opponentName) => {
    console.log("Start: ", num, "opponent: ", opponentName);
    setActivePlayer(num);
    setOpponentName(opponentName);
  };

  const getOpponentsTurn = (opponent, opponentFields) => {
    console.log(opponent, opponentFields);
    setPlayerTwoFields(opponentFields);
    setActivePlayer(1);
  };

  socket.current?.on("TicTacToeStart", getTTTStart);
  socket.current?.on("TicTacToeOpponent", getOpponentsTurn);

  ////////////////////////////////////

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

  const getApology = () => {
    const apologies = [
      "Sorry that I've spammed your pokefight!",
      "I will never ever spam or hack your sites again.",
      "I sincerely apologize for messing with the leaderboard on your pokefight.",
      "Please forgive me for spamming your server.",
    ];
    return apologies[Math.floor(Math.random() * apologies.length)];
  };

  const handleSendMessage = (e) => {
    const time = new Date();
    e.preventDefault();
    setIsLoading(true);
    console.log("submit fired: ", message);
    console.log("to room: ", currentRoom);
    if (currentRoom === "Master Reagan" && user.username !== "stephan") {
      const apology = getApology();
      socket.current.emit("message", apology, time, currentRoom, () =>
        setIsLoading(false)
      );
      setServerEvents((prev) => [
        ...prev,
        { message: apology, username: user.username, time },
      ]);
      setMessage("");
    } else {
      socket.current.emit("message", message, time, currentRoom, () =>
        setIsLoading(false)
      );
      setServerEvents((prev) => [
        ...prev,
        { message, username: user.username, time },
      ]);
      setMessage("");
    }
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
    socket.current = io("https://socket-chat-server-4qhi.onrender.com", {
      //http://localhost:5555
      // https://socket-chat-server-4qhi.onrender.com
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
      socket.current.off("TicTacToeOpponent", getOpponentsTurn);
      socket.current?.off("TicTacToeStart", getTTTStart);
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
        activePlayer,
        setActivePlayer,
        playerOneFields,
        setPlayerOneFields,
        playerTwoFields,
        setPlayerTwoFields,
        winner,
        setWinner,
        resetGame,
        opponentName,
        checkWin,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

ConnectionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
