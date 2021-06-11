import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetChartData {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetChartData = {
    data: [],
    loading: true,
    error: false,
    errorMsg: {},
};

export const getChartDataSlice = createSlice({
    name: 'getChartData',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getChartDataStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getChartDataSuccess: (state, action: PayloadAction<object>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getChartDataFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getChartDataStart, getChartDataSuccess, getChartDataFailed } = getChartDataSlice.actions;

export const fetchChartData = (ticker: string, period: string): AppThunk => (
    dispatch
) => {
    dispatch(getChartDataStart())
    baseURI.get(`/chart/${ticker}/${period}/details`)
    .then(res => {
        dispatch(getChartDataSuccess(res.data))
    }).catch(err => {
        dispatch(getChartDataFailed(err))
    })
};

export const data = (state: RootState) => state.getChartData.data;
export const loading = (state: RootState) => state.getChartData.loading;
export const error = (state: RootState) => state.getChartData.error;
export const errorMessage = (state: RootState) => state.getChartData.errorMsg;

export default getChartDataSlice.reducer;
