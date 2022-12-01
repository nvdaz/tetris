import Board from "../Board";
import Player from "../Player";

interface Command {
  execute(): void;
}

export default Command;
