import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import tokenSlice from "./token/tokenSlice";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

const store = configureStore({
    reducer: {
        token: tokenSlice
    },
    middleware: customizedMiddleware
});

export type RootState = ReturnType<typeof store.getState>;
export default store;