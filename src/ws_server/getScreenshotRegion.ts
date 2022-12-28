import { mouse, Region, screen } from "@nut-tree/nut-js";

const REGION_SIZE = 200;

export const getScreenshotRegion = async () => {
  const { x, y } = await mouse.getPosition();
  const screenWidth = await screen.width();
  const screenHeight = await screen.height();

  let left = x - REGION_SIZE / 2;
  let top = y - REGION_SIZE / 2;

  left = Math.max(0, left) && Math.min(left, screenWidth - REGION_SIZE);
  top = Math.max(0, top) && Math.min(top, screenHeight - REGION_SIZE);

  return new Region(left, top, REGION_SIZE, REGION_SIZE);
};
