import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import packageSlice from "./package/packageSlice";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

const store = configureStore({
    reducer: {
        packages: packageSlice,
    },
    middleware: customizedMiddleware
});

export type RootState = ReturnType<typeof store.getState>;
export default store;