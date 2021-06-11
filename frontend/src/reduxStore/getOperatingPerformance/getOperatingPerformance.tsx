import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetOperatingPerformance {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetOperatingPerformance = {
    data: [],
    loading: true,
    error: false,
    errorMsg: {},
};

export const getOperatingPerformanceSlice = createSlice({
    name: 'getOperatingPerformance',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getOperatingPerformanceStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getOperatingPerformanceSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getOperatingPerformanceFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getOperatingPerformanceStart, getOperatingPerformanceSuccess, getOperatingPerformanceFailed } = getOperatingPerformanceSlice.actions;

export const fetchOperatingPerformance = (performanceId: string): AppThunk => (
    dispatch
) => {
    dispatch(getOperatingPerformanceStart())
    baseURI.get(`/key-ratios/operating-performance/${performanceId}/details`)
    .then(res => {
        dispatch(getOperatingPerformanceSuccess(res.data))
    }).catch(err => {
        dispatch(getOperatingPerformanceFailed(err))
    })
};

export const operatingPerformancedata = (state: RootState) => state.getOperatingPerformance.data;
export const loadOperatingPerformance = (state: RootState) => state.getOperatingPerformance.loading;
export const error = (state: RootState) => state.getOperatingPerformance.error;
export const errorMessage = (state: RootState) => state.getOperatingPerformance.errorMsg;

export default getOperatingPerformanceSlice.reducer;
