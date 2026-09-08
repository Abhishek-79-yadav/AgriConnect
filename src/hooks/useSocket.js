import { useEffect } from "react";

import {
  connectSocket,
  disconnectSocket,
} from "../services/socketService";

export default function useSocket(
  eventName,
  callback
) {
  useEffect(() => {
    const socket =
      connectSocket();

    socket.on(
      eventName,
      callback
    );

    return () => {
      socket.off(
        eventName
      );

      disconnectSocket();
    };
  }, [eventName]);
}