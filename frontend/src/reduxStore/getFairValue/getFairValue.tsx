import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import axios from 'axios';

export interface GetFairValueState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetFairValueState = {
    data: [],
    loading: true,
    error: false,
    errorMsg: {},
};

export const getFairValueSlice = createSlice({
    name: 'getFairValue',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getFairValueStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getFairValueSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getFairValueFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getFairValueStart, getFairValueSuccess, getFairValueFailed } = getFairValueSlice.actions;

export const fetchFairValue = (ticker: string, performanceId: string): AppThunk => (
    dispatch
) => {
    dispatch(getFairValueStart())
    axios.get(`/api/v1/company-data/analysis/${ticker}/${performanceId}/details`)
        .then(res => {
            dispatch(getFairValueSuccess(res.data))
        }).catch(err => {
            dispatch(getFairValueFailed(err))
        })
};

export const fairValueData = (state: RootState) => state.getFairValue.data;
export const loadFairValue = (state: RootState) => state.getFairValue.loading;
export const error = (state: RootState) => state.getFairValue.error;
export const errorMessage = (state: RootState) => state.getFairValue.errorMsg;

export default getFairValueSlice.reducer;
