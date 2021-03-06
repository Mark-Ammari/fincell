import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import axios from 'axios';

export interface GetSearchTicker {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetSearchTicker = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getSearchTickerSlice = createSlice({
    name: 'getSearchTicker',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getSearchTickerStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getSearchTickerSuccess: (state, action: PayloadAction<object>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getSearchTickerFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getSearchTickerStart, getSearchTickerSuccess, getSearchTickerFailed } = getSearchTickerSlice.actions;

export const fetchSearchTicker = (ticker: string): AppThunk => (
    dispatch
) => {
    dispatch(getSearchTickerStart())
    axios.get(`/api/v1/company-data/search/${ticker}`)
    .then(res => {
        dispatch(getSearchTickerSuccess(res.data))
    }).catch(err => {
        dispatch(getSearchTickerFailed(err))
    })
};

export const searchTickerdata = (state: RootState) => state.getSearchTicker.data;
export const loadSearchTicker = (state: RootState) => state.getSearchTicker.loading;
export const searchTickerError = (state: RootState) => state.getSearchTicker.error;
export const searchTickerErrorMessage = (state: RootState) => state.getSearchTicker.errorMsg;

export default getSearchTickerSlice.reducer;
