import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { IBoardPermissions } from '@/features/board/types/board-permissions';

interface boardState {
   currrentBoardId: string,
   boardPermissions: IBoardPermissions | null
}

const initialState: boardState = {
   currrentBoardId: '',
   boardPermissions: null
};

export const boardSlice = createSlice({
   name: 'board',
   initialState,
   reducers: {
      setPermissions(state, action: PayloadAction<IBoardPermissions>) {
         state.boardPermissions = action.payload
      },
      setCurrentBoardId(state, action: PayloadAction<string>) {
         state.currrentBoardId = action.payload
      }
   },
});

export const { setPermissions, setCurrentBoardId } = boardSlice.actions;
export const selectPermissions = (state: RootState) => state.board.boardPermissions
export const selectCurrentBoardId = (state: RootState) => state.board.currrentBoardId

export default boardSlice.reducer;