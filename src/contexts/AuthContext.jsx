import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [triggerLogin, setTriggerLogin] = useState(false);

  // testuser:
  // username: supertester
  // email: super@tes.com
  // pw: 1Qwertzuiopü

  // 2. testuser:
  // username: secondante
  // email: second@dante.it
  // pw: 1Qwertzuiopü

  const handleAccess = async (e, endpoint = "login") => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const res = await fetch(`http://localhost:5555/user/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.log("res not ok: ", data);
      setIsLoading(false);
      setError(data.error);
    }
    if (res.ok) {
      console.log("setting to localStorage: ", data);
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
      setUser(data);
      setTriggerLogin(true);
    }
  };

  const removeUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const getUserRooms = (rooms) => {
    setUser((prev) => {
      return { ...prev, rooms };
    });
  };

  useEffect(() => {
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        error,
        setError,
        isLoading,
        setIsLoading,
        user,
        setUser,
        handleAccess,
        removeUser,
        getUserRooms,
        triggerLogin,
        setTriggerLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
