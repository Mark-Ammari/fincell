import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetKeyStatsState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetKeyStatsState = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getKeyStatsSlice = createSlice({
    name: 'getKeyStats',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getKeyStatsStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getKeyStatsSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getKeyStatsFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getKeyStatsStart, getKeyStatsSuccess, getKeyStatsFailed } = getKeyStatsSlice.actions;

export const fetchKeyStats = (ticker: string): AppThunk => (
    dispatch
) => {
    dispatch(getKeyStatsStart())
    baseURI.get(`/key-ratios/stats/${ticker}/details`)
    .then(res => {
        dispatch(getKeyStatsSuccess(res.data))
    }).catch(err => {
        dispatch(getKeyStatsFailed(err))
    })
};

export const keyStatsdata = (state: RootState) => state.getKeyStats.data;
export const loadKeyStats = (state: RootState) => state.getKeyStats.loading;
export const error = (state: RootState) => state.getKeyStats.error;
export const errorMessage = (state: RootState) => state.getKeyStats.errorMsg;

export default getKeyStatsSlice.reducer;
