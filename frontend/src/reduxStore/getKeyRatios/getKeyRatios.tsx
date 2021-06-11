import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import baseURI from '../../URI/URI';

export interface GetKeyRatios {
    data: any,
    loading: boolean,
    error: boolean,
    errorMsg: object,
}

const initialState: GetKeyRatios = {
    data: {},
    loading: true,
    error: false,
    errorMsg: {},
};

export const getKeyRatiosSlice = createSlice({
    name: 'getKeyRatios',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        getKeyRatiosStart: (state) => {
            state.data = []
            state.loading = true
            state.error = false
            state.errorMsg = {}
        },
        getKeyRatiosSuccess: (state, action: PayloadAction<any>) => {
            state.data = action.payload
            state.loading = false
            state.error = false
            state.errorMsg = {}
        },
        getKeyRatiosFailed: (state, action: PayloadAction<object>) => {
            state.data = []
            state.loading = false
            state.error = true
            state.errorMsg = action.payload
        },
    },
});

export const { getKeyRatiosStart, getKeyRatiosSuccess, getKeyRatiosFailed } = getKeyRatiosSlice.actions;

export const fetchKeyRatios = (ratioType: string, performanceId: string): AppThunk => (
    dispatch
) => {
    dispatch(getKeyRatiosStart())
    baseURI.get(`/keyratios/${ratioType}/${performanceId}/details`)
    .then(res => {
        dispatch(getKeyRatiosSuccess(res.data))
    }).catch(err => {
        dispatch(getKeyRatiosFailed(err))
    })
};

export const data = (state: RootState) => state.getKeyRatios.data;
export const loading = (state: RootState) => state.getKeyRatios.loading;
export const error = (state: RootState) => state.getKeyRatios.error;
export const errorMessage = (state: RootState) => state.getKeyRatios.errorMsg;

export default getKeyRatiosSlice.reducer;
