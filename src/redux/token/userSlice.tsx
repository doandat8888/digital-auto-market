import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/user.type'

interface UserState {
    user?: User
}

const initialState: UserState = {
    user: undefined,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        logOut: (state) => {
            state.user = undefined
        },
    },
})

export const { setUser, logOut } = userSlice.actions
export default userSlice.reducer
