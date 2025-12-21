import type { IUser } from '@/shared/types/user.types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';

interface userState {
	user: IUser | null;
}

const initialState: userState = {
	user: null
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<IUser | null>) {
			state.user = action.payload
		}
	},
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user

export default userSlice.reducer;