import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import getFinancialStatementReducer from './getFinancialStatement/getFinancialStatement';

export const store = configureStore({
  reducer: {
    getFinancialStatement: getFinancialStatementReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
