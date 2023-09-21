import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _const from '../../const';

const packagesJSON = localStorage.getItem('packages');
const items = packagesJSON ? JSON.parse(packagesJSON) : []

interface PackageState {
    value: IPackage[];
}

const initialState: PackageState = {
    value: items
}

const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        addPackage: (state, action: PayloadAction<IPackage>) => {
            let packageDuplicate = findItem(state.value, action.payload);
            if(packageDuplicate.length === 0) {
                state.value = [
                    ...state.value,
                    {
                        ...action.payload,
                        no: state.value.length > 0 ? state.value[state.value.length - 1].no + 1 : 1
                    }
                ]
            }
            localStorage.setItem("packages", JSON.stringify(state.value.sort((a, b) => a.no > b.no ? 1 : (a.no < b.no) ? -1 : 0 )))
        },
        removePackage: (state, action: PayloadAction<string>) => {
            state.value = state.value.filter((packageItem: IPackage) => packageItem.id !== action.payload);
            localStorage.setItem("packages", JSON.stringify(state.value.sort((a, b) => a.no > b.no ? 1 : (a.no < b.no) ? -1 : 0 )));
        },
        removeAllPakage: (state) => {
            state.value = [];
            localStorage.setItem("packages", JSON.stringify(state.value.sort((a, b) => a.no > b.no ? 1 : (a.no < b.no) ? -1 : 0 )));
        },
    },
});

const findItem = (packages: IPackage[], item: IPackage) => packages.filter(packageItem => packageItem.id === item.id && packageItem.name === item.name) //Hàm này để tìm thằng bị trùng

export const { addPackage, removePackage, removeAllPakage } = packageSlice.actions;
export default packageSlice.reducer;
