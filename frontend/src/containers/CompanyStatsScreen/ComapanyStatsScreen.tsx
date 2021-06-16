import React from 'react';
import classes from './CompanyStatsScreen.module.css';
import StatsPanel from '../../components/StatsPanel/StatsPanel';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { searchTickerdata, fetchSearchTicker, loadSearchTicker } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { useParams } from 'react-router';
import { fetchIncomeStatement } from '../../reduxStore/getIncomeStatement/getIncomeStatement';
import { fetchBalanceSheet } from '../../reduxStore/getBalanceSheet/getBalanceSheet';
import { fetchCashFlow } from '../../reduxStore/getCashFlow/getCashFlow';
import { fetchFinancialStats } from '../../reduxStore/getFinancialStats/getFinancialStats';
import { fetchKeyStats } from '../../reduxStore/getKeyStats/getKeyStats';

const CompanyStatsScreen: React.FC = () => {
    const { ticker } = useParams<any>();
    const tickerData = useSelector(searchTickerdata);
    const loadTickerData = useSelector(loadSearchTicker);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSearchTicker(ticker))
        dispatch(fetchIncomeStatement(ticker))
        dispatch(fetchBalanceSheet(ticker))
        dispatch(fetchCashFlow(ticker))
        dispatch(fetchFinancialStats(ticker))
        dispatch(fetchKeyStats(ticker))
    }, [ticker, dispatch])

    return (
        <section className={classes.CompanyStatsScreen}>
            {
                loadTickerData ? null :
                    <>
                        <div className={classes.TickerDetails}>
                            <h1 className={classes.CompanyName}>{tickerData.results[0].name + ' ' + `(${tickerData.results[0].ticker})`}</h1>
                        </div>
                        <StatsPanel />
                    </>
            }
        </section>
    );
};

export default CompanyStatsScreen;

