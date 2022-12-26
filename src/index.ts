import { httpServer } from "./http_server/index";
import { WebSocketServer } from "ws";
import { configureSocket } from "./ws_server";
import "dotenv/config";

const DEFAULT_HTTP_PORT = 8181;
const DEFAULT_WS_PORT = 8080;

const HTTP_PORT = Number(process.env.HTTP_PORT) || DEFAULT_HTTP_PORT;
const WS_PORT = Number(process.env.WS_PORT) || DEFAULT_WS_PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocketServer({ port: WS_PORT });
console.log(`Start websocket server on the ${WS_PORT} port!`);
configureSocket(socket);
