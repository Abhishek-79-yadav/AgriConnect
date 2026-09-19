import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  connectSocket,
  disconnectSocket,
} from "../services/socketService";

const SocketContext =
  createContext(null);

export const SocketProvider = ({
  children,
}) => {
  const [socket, setSocket] =
    useState(null);

  useEffect(() => {
    const instance =
      connectSocket();

    setSocket(instance);

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext =
  () =>
    useContext(
      SocketContext
    );