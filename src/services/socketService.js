import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectSocket = () => {
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(
        `${import.meta.env.VITE_SOCKET_URL}/ws`
      ),

    reconnectDelay: 5000,

    onConnect: () => {
      if (import.meta.env.DEV) {
        console.log("WebSocket Connected");
      }
    },

    onStompError: (frame) => {
      console.error(
        frame
      );
    },
  });

  stompClient.activate();

  return stompClient;
};

export const disconnectSocket =
  () => {
    stompClient?.deactivate();
  };

export const getSocket =
  () => stompClient;