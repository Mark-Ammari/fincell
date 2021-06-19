import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetIncomeStatementState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetIncomeStatementState = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getIncomeStatementSlice = createSlice({
    name: 'getIncomeStatement',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getIncomeStatementStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getIncomeStatementSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getIncomeStatementFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getIncomeStatementStart, getIncomeStatementSuccess, getIncomeStatementFailed } = getIncomeStatementSlice.actions;

export const fetchIncomeStatement = (ticker: string, period?: string): AppThunk => (
    dispatch
) => {
    dispatch(getIncomeStatementStart())
    baseURI.get(`report-type/income-statement/${ticker}/details?period=${period || "12"}`)
    .then(res => {
        dispatch(getIncomeStatementSuccess(res.data))
    }).catch(err => {
        dispatch(getIncomeStatementFailed(err))
    })
};

export const incomeStatementdata = (state: RootState) => state.getIncomeStatement.data;
export const loadIncomeStatement = (state: RootState) => state.getIncomeStatement.loading;
export const error = (state: RootState) => state.getIncomeStatement.error;
export const errorMessage = (state: RootState) => state.getIncomeStatement.errorMsg;

export default getIncomeStatementSlice.reducer;
