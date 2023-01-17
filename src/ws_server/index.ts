import { createWebSocketStream, Server, WebSocket } from "ws";
import { controller } from "./controller";
import { isValidCommand } from "./typeGuards";

export const configureSocket = (wss: Server<WebSocket>) => {
  wss.on("connection", (client, req) => {
    const { remotePort } = req.socket;
    console.log(
      `New connection established (port: ${remotePort}). Clients connected: ${wss.clients.size}`
    );

    const duplex = createWebSocketStream(client, {
      encoding: "utf-8",
      decodeStrings: false,
    });

    duplex.on("readable", async () => {
      let data;
      let message = "";

      while ((data = duplex.read()) !== null) {
        message += data;
      }

      if (message.trim()) {
        console.log(`Received message: ${message}`);
      }

      const [cmd, ...rest] = message.toString().split(" ");
      const args = rest.map(Number);

      if (isValidCommand(cmd)) {
        const result = await controller[cmd](args, duplex);
        const response = result ? [cmd, result].join(" ") : message;
        console.log(`Sending response: ${response}`);
        duplex.write(response);
      }
    });

    duplex.on("error", console.error);

    client.on("error", console.error);

    client.on("close", () => {
      console.log(
        `Connection closed by client. Clients left: ${wss.clients.size}`
      );
    });
  });
};
