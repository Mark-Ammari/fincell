import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import getSeatchTickerReducer from './getSearchTicker/getSearchTicker';
import getQuoteReducer from './getQuote/getQuote';
import getChartDataReducer from './getChartData/getChartData';
import getBalanceSheetReducer from './getBalanceSheet/getBalanceSheet';
import getIncomeStatementReducer from './getIncomeStatement/getIncomeStatement';
import getCashFlowReducer from './getCashFlow/getCashFlow';
import getFinancialStatsReducer from './getFinancialStats/getFinancialStats';
import getKeyStatsReducer from './getKeyStats/getKeyStats';

export const store = configureStore({
  reducer: {
    getSearchTicker: getSeatchTickerReducer,
    getQuote: getQuoteReducer,
    getChartData: getChartDataReducer,
    getBalanceSheet: getBalanceSheetReducer,
    getIncomeStatement: getIncomeStatementReducer,
    getCashFlow: getCashFlowReducer,
    getFinancialStats: getFinancialStatsReducer,
    getKeyStats: getKeyStatsReducer
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
