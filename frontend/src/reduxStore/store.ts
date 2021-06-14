import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import getSeatchTickerReducer from './getSearchTicker/getSearchTicker';
import getQuoteReducer from './getQuote/getQuote';
import getChartDataReducer from './getChartData/getChartData';
import getValuationReducer from './getValuation/getValuation';
import getOperatingPerformanceReducer from './getOperatingPerformance/getOperatingPerformance';
import getBalanceSheetReducer from './getBalanceSheet/getBalanceSheet';
import getIncomeStatementReducer from './getIncomeStatement/getIncomeStatement';
import getCashFlowReducer from './getCashFlow/getCashFlow';

export const store = configureStore({
  reducer: {
    getSearchTicker: getSeatchTickerReducer,
    getQuote: getQuoteReducer,
    getChartData: getChartDataReducer,
    getValuation: getValuationReducer,
    getOperatingPerformance: getOperatingPerformanceReducer,
    getBalanceSheet: getBalanceSheetReducer,
    getIncomeStatement: getIncomeStatementReducer,
    getCashFlow: getCashFlowReducer
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
