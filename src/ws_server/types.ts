import internal from "stream";

export enum Commands {
  MOUSE_UP = "mouse_up",
  MOUSE_DOWN = "mouse_down",
  MOUSE_LEFT = "mouse_left",
  MOUSE_RIGHT = "mouse_right",
  MOUSE_POSITION = "mouse_position",
  DRAW_CIRCLE = "draw_circle",
  DRAW_SQUARE = "draw_square",
  DRAW_RECTANGLE = "draw_rectangle",
  PRNT_SCRN = "prnt_scrn",
}

type CommandHandler = (
  args: number[],
  duplex: internal.Duplex
) => Promise<void>;

export type Controller = Record<Commands, CommandHandler>;

export function isValidComand(cmd: any): cmd is Commands {
  return Object.values(Commands).includes(cmd);
}
