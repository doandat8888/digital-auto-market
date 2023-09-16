import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _const from '../../const';

interface PackageState {
    value: IPackage[];
}

const initialState: PackageState = {
    value: _const.packageListFake,
};

const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        addPackage: (state, action: PayloadAction<IPackage>) => {
            state.value.push(action.payload);
        },
        removePackage: (state, action: PayloadAction<Number>) => {
            state.value = state.value.filter((packageItem: IPackage) => packageItem.id !== action.payload);
        },
    },
});

export const { addPackage, removePackage } = packageSlice.actions;
export default packageSlice.reducer;
