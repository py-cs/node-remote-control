import { httpServer } from "./http_server/index";
import { WebSocketServer } from "ws";
import { configureSocket } from "./ws_server";

import "dotenv/config";

const DEFAULT_HTTP_PORT = 8181;
const DEFAULT_WS_PORT = 8080;

const HTTP_PORT = Number(process.env.HTTP_PORT) || DEFAULT_HTTP_PORT;
const WS_PORT = Number(process.env.WS_PORT) || DEFAULT_WS_PORT;

console.log(`Static http server started on http://localhost:${HTTP_PORT}`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocketServer({ port: WS_PORT });
console.log(`Websocket server started on port ${WS_PORT}`);
configureSocket(wss);

process.on("SIGINT", () => {
  console.log("Process terminated, shutting down websocket server");
  wss.clients.forEach((socket) => socket.close());
  wss.close();
});
