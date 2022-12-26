import { WebSocketServer, Server, WebSocket } from "ws";
import {
  mouse,
  up,
  down,
  left,
  right,
  Button,
  Point,
  straightTo,
  Region,
  screen,
} from "@nut-tree/nut-js";
import { readFile } from "fs/promises";

export const configureSocket = (socket: Server<WebSocket>) => {
  socket.on("connection", (socket) => {
    console.log("Connection established");
    socket.on("message", (message) => {
      console.log(`Received message: ${message}`);
      const [cmd, ...rest] = message.toString().split(" ");
      const args = rest.map(Number);
      switch (cmd) {
        case "mouse_up":
          (async () => {
            await mouse.move(up(args[0]));
          })();
          break;
        case "mouse_down":
          (async () => {
            await mouse.move(down(args[0]));
          })();
          break;
        case "mouse_left":
          (async () => {
            await mouse.move(left(args[0]));
          })();
          break;
        case "mouse_right":
          (async () => {
            await mouse.move(right(args[0]));
          })();
          break;
        case "mouse_position":
          (async () => {
            const { x, y } = await mouse.getPosition();
            const response = `mouse_position ${x},${y}`;
            console.log(response);
            socket.send(response);
          })();
          break;
        case "draw_square":
          (async () => {
            const [size] = args;
            await mouse.pressButton(Button.LEFT);
            await mouse.move(right(size));
            await mouse.move(down(size));
            await mouse.move(left(size));
            await mouse.move(up(size));
            await mouse.releaseButton(Button.LEFT);
          })();
          break;
        case "draw_rectangle":
          (async () => {
            const [width, height] = args;
            await mouse.pressButton(Button.LEFT);
            await mouse.move(right(width));
            await mouse.move(down(height));
            await mouse.move(left(width));
            await mouse.move(up(height));
            await mouse.releaseButton(Button.LEFT);
          })();
          break;
        case "draw_circle":
          (async () => {
            const [radius] = args;
            const { x, y } = await mouse.getPosition();
            const centerPoint = new Point(x, y + radius);
            const steps = 50;
            let currentAngle = 0;
            await mouse.pressButton(Button.LEFT);
            for (let i = 0; i < steps; i++) {
              currentAngle += (Math.PI * 2) / steps;
              const nextPoint = new Point(
                centerPoint.x + radius * Math.sin(currentAngle),
                centerPoint.y - radius * Math.cos(currentAngle)
              );
              await mouse.move(straightTo(nextPoint));
            }
            await mouse.releaseButton(Button.LEFT);
          })();
          break;
        case "prnt_scrn":
          (async () => {
            const { x, y } = await mouse.getPosition();
            const region = new Region(x - 100, y - 100, 200, 200);
            screen.highlight(region);
            console.log(region);
            const pngFile = await screen.captureRegion("output.png", region);
            const bufferArray = await readFile(pngFile);
            const response = `prnt_scrn ${bufferArray.toString("base64")}`;
            console.log(response);
            socket.send(response);
          })();
          break;
        default:
          console.log(message);
          break;
      }
    });
  });

  socket.on("close", () => {
    console.log("Disconnected");
  });
};
