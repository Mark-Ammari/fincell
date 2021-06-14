import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetCashFlowState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetCashFlowState = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getCashFlowSlice = createSlice({
    name: 'getCashFlow',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getCashFlowStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getCashFlowSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getCashFlowFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getCashFlowStart, getCashFlowSuccess, getCashFlowFailed } = getCashFlowSlice.actions;

export const fetchCashFlow = (ticker: string): AppThunk => (
    dispatch
) => {
    dispatch(getCashFlowStart())
    baseURI.get(`report-type/cash-flow/${ticker}/details`)
    .then(res => {
        dispatch(getCashFlowSuccess(res.data))
    }).catch(err => {
        dispatch(getCashFlowFailed(err))
    })
};

export const cashFlowdata = (state: RootState) => state.getCashFlow.data;
export const loadCashFlow = (state: RootState) => state.getCashFlow.loading;
export const error = (state: RootState) => state.getCashFlow.error;
export const errorMessage = (state: RootState) => state.getCashFlow.errorMsg;

export default getCashFlowSlice.reducer;
