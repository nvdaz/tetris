import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

type GameStatus = 'title' | 'play' | 'gameOver';

interface GameState {
  status: GameStatus;
  score: number;
}

const initialState: GameState = { status: 'title', score: 0 };

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameStatus(state, action: PayloadAction<GameStatus>) {
      state.status = action.payload;
    },
    resetScore(state) {
      state.score = 0;
    },
    increaseScore(state, action: PayloadAction<number>) {
      state.score += action.payload;
    },
  },
});

export const { setGameStatus, resetScore, increaseScore } = gameSlice.actions;

export const selectGameStatus = (state: RootState) => state.game.status;
export const selectScore = (state: RootState) => state.game.score;

export default gameSlice.reducer;
