import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import getFinancialStatementReducer from './getFinancialStatement/getFinancialStatement';
import getSeatchTickerReducer from './getSearchTicker/getSearchTicker';

export const store = configureStore({
  reducer: {
    getFinancialStatement: getFinancialStatementReducer,
    getSearchTicker: getSeatchTickerReducer
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
