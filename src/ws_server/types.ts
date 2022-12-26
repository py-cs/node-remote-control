export const enum Commands {
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

type CommandHandler = (args: number[]) => Promise<void | string>;

export type Controller = Record<Commands, CommandHandler>;
