import { httpServer } from "./http_server/index";
import { mouse } from "@nut-tree/nut-js";
import "dotenv/config";

const DEFAULT_HTTP_PORT = 8181;
const DEFAULT_WS_PORT = 8080;

const HTTP_PORT = process.env.HTTP_PORT || DEFAULT_HTTP_PORT;
const WS_PORT = process.env.WS_PORT || DEFAULT_WS_PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
