import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import axios from 'axios';

export interface GetFinancialStatsState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetFinancialStatsState = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getFinancialStatsSlice = createSlice({
    name: 'getFinancialStats',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getFinancialStatsStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getFinancialStatsSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getFinancialStatsFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getFinancialStatsStart, getFinancialStatsSuccess, getFinancialStatsFailed } = getFinancialStatsSlice.actions;

export const fetchFinancialStats= (ticker: string): AppThunk => (
    dispatch
) => {
    dispatch(getFinancialStatsStart())
    axios.get(`/api/v1/company-data/key-ratios/financials/${ticker}/details`)
    .then(res => {
        dispatch(getFinancialStatsSuccess(res.data))
    }).catch(err => {
        dispatch(getFinancialStatsFailed(err))
    })
};

export const financialStatsdata = (state: RootState) => state.getFinancialStats.data;
export const loadFinancialStats = (state: RootState) => state.getFinancialStats.loading;
export const error = (state: RootState) => state.getFinancialStats.error;
export const errorMessage = (state: RootState) => state.getFinancialStats.errorMsg;

export default getFinancialStatsSlice.reducer;
