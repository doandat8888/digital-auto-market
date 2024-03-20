import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import tokenSlice from './token/tokenSlice'
import userSlice from './token/userSlice'

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false,
})

const store = configureStore({
    reducer: {
        token: tokenSlice,
        user: userSlice,
    },
    middleware: customizedMiddleware,
})

export type RootState = ReturnType<typeof store.getState>
export default store
