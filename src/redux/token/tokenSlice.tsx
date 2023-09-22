import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const item = token ? token : "";

interface TokenState {
    value: string;
}

const initialState: TokenState = {
    value: item
}

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        addToken: (state, action: PayloadAction<string>) => {
            state.value = action.payload
            localStorage.setItem("token", state.value);
        },
        removeToken: (state) => {
            state.value = "";
            localStorage.removeItem("token");
        },
    },
});

export const { addToken, removeToken } = tokenSlice.actions;
export default tokenSlice.reducer;
