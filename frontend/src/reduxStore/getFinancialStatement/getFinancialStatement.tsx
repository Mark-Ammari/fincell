import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState, AppThunk } from '../store';

export interface GetFinancialStatementState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetFinancialStatementState = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getFinancialStatementSlice = createSlice({
    name: 'getFinancialStatement',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getFinancialStatementStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getFinancialStatementSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getFinancialStatementFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getFinancialStatementStart, getFinancialStatementSuccess, getFinancialStatementFailed } = getFinancialStatementSlice.actions;

export const fetchFinancialStatement = (ticker: string, statementType: string, period?: string): AppThunk => (
    dispatch
) => {
    dispatch(getFinancialStatementStart())
    axios.get(`/api/v1/company-data/report-type/${statementType}/${ticker}/details?period=${period}`)
        .then(res => {
            dispatch(getFinancialStatementSuccess(res.data))
        }).catch(err => {
            dispatch(getFinancialStatementFailed(err))
        })
};

export const financialStatementData = (state: RootState) => state.getFinancialStatement.data;
export const loadFinancialStatement = (state: RootState) => state.getFinancialStatement.loading;
export const error = (state: RootState) => state.getFinancialStatement.error;
export const errorMessage = (state: RootState) => state.getFinancialStatement.errorMsg;

export default getFinancialStatementSlice.reducer;
