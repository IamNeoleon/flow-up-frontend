import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { IBoardPermissions } from '@/shared/constants/board.permissions';

interface boardState {
   boardPermissions: IBoardPermissions | null
}

const initialState: boardState = {
   boardPermissions: null
};

export const boardSlice = createSlice({
   name: 'board',
   initialState,
   reducers: {
      setPermissions(state, action: PayloadAction<IBoardPermissions>) {
         state.boardPermissions = action.payload
      }
   },
});

export const { setPermissions } = boardSlice.actions;
export const selectPermissions = (state: RootState) => state.board.boardPermissions

export default boardSlice.reducer;