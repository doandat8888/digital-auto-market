import { configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import packageSlice from "./package/packageSlice";
import thunk from 'redux-thunk';

const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
    reducer: {
        packages: packageSlice,
    },
    middleware: middleware
});

export type RootState = ReturnType<typeof store.getState>;
export default store;