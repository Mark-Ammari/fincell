import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import getFinancialStatementReducer from './getFinancialStatement/getFinancialStatement';
import getSeatchTickerReducer from './getSearchTicker/getSearchTicker';
import getQuoteReducer from './getQuote/getQuote';
import getChartDataReducer from './getChartData/getChartData';
import getValuationReducer from './getValuation/getValuation';
import getOperatingPerformanceReducer from './getOperatingPerformance/getOperatingPerformance';

export const store = configureStore({
  reducer: {
    getFinancialStatement: getFinancialStatementReducer,
    getSearchTicker: getSeatchTickerReducer,
    getQuote: getQuoteReducer,
    getChartData: getChartDataReducer,
    getValuation: getValuationReducer,
    getOperatingPerformance: getOperatingPerformanceReducer
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
