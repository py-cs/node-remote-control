import { Commands } from "./types";

export function isValidCommand(cmd: any): cmd is Commands {
  return Object.values(Commands).includes(cmd);
}
