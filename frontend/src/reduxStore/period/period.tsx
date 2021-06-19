import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface PeriodState {
    value: string,
}

const initialState: PeriodState = {
    value: "12",
};

export const periodSlice = createSlice({
    name: 'period',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        changePeriod: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
    },
});

export const { changePeriod } = periodSlice.actions;

export const switchPeriod = (value: string): AppThunk => (
    dispatch
) => {
    dispatch(changePeriod(value))
};

export const valueOfPeriod = (state: RootState) => state.period.value;

export default periodSlice.reducer;
