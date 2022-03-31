import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import axios from 'axios';

export interface GetQuote {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetQuote = {
    data: [],
    loading: true,
    error: false,
    errorMsg: {},
};

export const getQuoteSlice = createSlice({
    name: 'getQuote',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getQuoteStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getQuoteSuccess: (state, action: PayloadAction<object>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getQuoteFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getQuoteStart, getQuoteSuccess, getQuoteFailed } = getQuoteSlice.actions;

export const fetchQuote= (performanceId: string): AppThunk => (
    dispatch
) => {
    dispatch(getQuoteStart())
    axios.get(`/api/v1/company-data/quote/${performanceId}/details`)
    .then(res => {
        dispatch(getQuoteSuccess(res.data))
    }).catch(err => {
        dispatch(getQuoteFailed(err))
    })
};

export const quoteData = (state: RootState) => state.getQuote.data;
export const loadQuote = (state: RootState) => state.getQuote.loading;
export const error = (state: RootState) => state.getQuote.error;
export const errorMessage = (state: RootState) => state.getQuote.errorMsg;

export default getQuoteSlice.reducer;
