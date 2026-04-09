import { useEffect } from "react";
import io from "socket.io-client";

export default function useSocket() {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    return () => socket.disconnect();
  }, []);
}