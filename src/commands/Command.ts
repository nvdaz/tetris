import Grid from '../Grid';
import Player from '../Player';

interface Command {
  constructor(player: Player, grid: Grid);
  execute(): void;
}
