import internal from "stream";
import { createWebSocketStream, Server, WebSocket } from "ws";
import { controller } from "./controller";
import { isValidComand } from "./types";

export const configureSocket = (wss: Server<WebSocket>) => {
  wss.on("connection", (client) => {
    console.log("Connection established");

    const duplex = createWebSocketStream(client, {
      encoding: "utf-8",
      decodeStrings: false,
    });

    duplex.on("error", console.error);

    duplex.on("readable", () => {
      let data;
      let message = "";

      while ((data = duplex.read()) !== null) {
        message += data;
      }

      console.log(`Received message: ${message}`);

      const [cmd, ...rest] = message.toString().split(" ");
      const args = rest.map(Number);

      if (isValidComand(cmd)) {
        controller[cmd](args, duplex);
      } else {
        // throw Error(`Command is not supported (${cmd})`);
      }
    });

    client.on("close", () => {
      console.log("Connection closed by client");
    });

    client.on("error", console.error);
  });
};
