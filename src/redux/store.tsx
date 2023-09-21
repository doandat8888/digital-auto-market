import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import packageSlice from "./package/packageSlice";
import tokenSlice from "./token/tokenSlice";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

const store = configureStore({
    reducer: {
        packages: packageSlice,
        token: tokenSlice
    },
    middleware: customizedMiddleware
});

export type RootState = ReturnType<typeof store.getState>;
export default store;