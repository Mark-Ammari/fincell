import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

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
    baseURI.get(`/search/${ticker}`)
    .then(res => {
        dispatch(getSearchTickerSuccess(res.data))
    }).catch(err => {
        dispatch(getSearchTickerFailed(err))
    })
};

export const data = (state: RootState) => state.getSearchTicker.data;
export const loading = (state: RootState) => state.getSearchTicker.loading;
export const error = (state: RootState) => state.getSearchTicker.error;
export const errorMessage = (state: RootState) => state.getSearchTicker.errorMsg;

export default getSearchTickerSlice.reducer;
