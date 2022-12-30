import {
  down,
  left,
  mouse,
  right,
  up,
  Button,
  Point,
  straightTo,
  screen,
} from "@nut-tree/nut-js";
import Jimp from "jimp";
import { Commands, Controller } from "./types";
import { getScreenshotRegion } from "./getScreenshotRegion";

const CIRCLE_FRAGMENTS = 100;

export const controller: Controller = {
  [Commands.MOUSE_UP]: async ([distance]: number[]) => {
    mouse.move(up(distance));
  },

  [Commands.MOUSE_DOWN]: async ([distance]: number[]) => {
    mouse.move(down(distance));
  },

  [Commands.MOUSE_LEFT]: async ([distance]: number[]) => {
    mouse.move(left(distance));
  },

  [Commands.MOUSE_RIGHT]: async ([distance]: number[]) => {
    mouse.move(right(distance));
  },

  [Commands.MOUSE_POSITION]: async () => {
    const { x, y } = await mouse.getPosition();
    const response = `${x},${y}`;
    return response;
  },

  [Commands.DRAW_CIRCLE]: async ([radius]: number[]) => {
    const { x, y } = await mouse.getPosition();
    const centerPoint = new Point(x, y + radius);
    let currentAngle = 0;
    await mouse.pressButton(Button.LEFT);
    for (let i = 0; i < CIRCLE_FRAGMENTS; i++) {
      currentAngle += (Math.PI * 2) / CIRCLE_FRAGMENTS;
      const nextPoint = new Point(
        centerPoint.x + radius * Math.sin(currentAngle),
        centerPoint.y - radius * Math.cos(currentAngle)
      );
      await mouse.move(straightTo(nextPoint));
    }
    await mouse.releaseButton(Button.LEFT);
  },

  [Commands.DRAW_SQUARE]: async ([size]: number[]) => {
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(size));
    await mouse.move(down(size));
    await mouse.move(left(size));
    await mouse.move(up(size));
    await mouse.releaseButton(Button.LEFT);
  },

  [Commands.DRAW_RECTANGLE]: async ([width, height]: number[]) => {
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(width));
    await mouse.move(down(height));
    await mouse.move(left(width));
    await mouse.move(up(height));
    await mouse.releaseButton(Button.LEFT);
  },

  [Commands.PRNT_SCRN]: async () => {
    const region = await getScreenshotRegion();

    screen.highlight(region);
    const image = await screen.grabRegion(region);
    const { data, width, height } = await image.toRGB();

    const base64image = await new Promise<string>((resolve) => {
      new Jimp({ data, width, height }, async (_, image) => {
        const img = await image.getBase64Async(Jimp.MIME_PNG);
        resolve(img.slice(img.indexOf(",") + 1));
      });
    });

    return base64image;
  },
};
