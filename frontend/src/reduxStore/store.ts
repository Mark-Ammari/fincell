import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import getSeatchTickerReducer from './getSearchTicker/getSearchTicker';
import getQuoteReducer from './getQuote/getQuote';
import getChartDataReducer from './getChartData/getChartData';
import getFinancialStatsReducer from './getFinancialStats/getFinancialStats';
import getKeyStatsReducer from './getKeyStats/getKeyStats';
import periodReducer from './period/period';
import getFinancialStatementReducer from './getFinancialStatement/getFinancialStatement';

export const store = configureStore({
  reducer: {
    getSearchTicker: getSeatchTickerReducer,
    getQuote: getQuoteReducer,
    getChartData: getChartDataReducer,
    getFinancialStats: getFinancialStatsReducer,
    getKeyStats: getKeyStatsReducer,
    period: periodReducer,
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
