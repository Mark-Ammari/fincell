import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetValuation {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetValuation = {
    data: [],
    loading: true,
    error: false,
    errorMsg: {},
};

export const getValuationSlice = createSlice({
    name: 'getValuation',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getValuationStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getValuationSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getValuationFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getValuationStart, getValuationSuccess, getValuationFailed } = getValuationSlice.actions;

export const fetchValuation = (performanceId: string): AppThunk => (
    dispatch
) => {
    dispatch(getValuationStart())
    baseURI.get(`/keyratios/valuation/${performanceId}/details`)
    .then(res => {
        dispatch(getValuationSuccess(res.data))
    }).catch(err => {
        dispatch(getValuationFailed(err))
    })
};

export const valuationData = (state: RootState) => state.getValuation.data;
export const loadValuation = (state: RootState) => state.getValuation.loading;
export const error = (state: RootState) => state.getValuation.error;
export const errorMessage = (state: RootState) => state.getValuation.errorMsg;

export default getValuationSlice.reducer;
