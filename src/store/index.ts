import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/api/baseApi'
import userReducer from './slices/userSlice'
import boardReducer from './slices/boardSlice'

export const store = configureStore({
   reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      user: userReducer,
      board: boardReducer
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch