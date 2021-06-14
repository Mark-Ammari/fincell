import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetBalanceSheetState {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetBalanceSheetState = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getBalanceSheetSlice = createSlice({
    name: 'getBalanceSheet',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getBalanceSheetStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getBalanceSheetSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getBalanceSheetFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getBalanceSheetStart, getBalanceSheetSuccess, getBalanceSheetFailed } = getBalanceSheetSlice.actions;

export const fetchBalanceSheet = (ticker: string): AppThunk => (
     dispatch
) => {
    dispatch(getBalanceSheetStart())
    baseURI.get(`report-type/balance-sheet/${ticker}/details`)
    .then(res => {
        dispatch(getBalanceSheetSuccess(res.data))
    }).catch(err => {
        dispatch(getBalanceSheetFailed(err))
    })
};

export const balanceSheetata = (state: RootState) => state.getBalanceSheet.data;
export const loadBalanceSheet = (state: RootState) => state.getBalanceSheet.loading;
export const error = (state: RootState) => state.getBalanceSheet.error;
export const errorMessage = (state: RootState) => state.getBalanceSheet.errorMsg;

export default getBalanceSheetSlice.reducer;
