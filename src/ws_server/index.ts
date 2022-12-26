import { Server, WebSocket } from "ws";
import { controller } from "./controller";
import { Commands } from "./types";

export const configureSocket = (wss: Server<WebSocket>) => {
  wss.on("connection", (socket) => {
    console.log("Connection established");

    socket.on("message", async (message) => {
      console.log(`Received message: ${message}`);

      const [cmd, ...rest] = message.toString().split(" ");
      const args = rest.map(Number);

      const response = await controller[cmd as Commands](args);

      if (response) {
        console.log(`Sending response: ${response}`);
        socket.send(response);
      }
    });

    socket.on("close", () => {
      console.log("Connection closed by client");
    });

    socket.on("error", (error) => {
      console.error(error);
    });
  });
};
