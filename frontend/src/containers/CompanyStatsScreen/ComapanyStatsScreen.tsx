import React from 'react';
import classes from './CompanyStatsScreen.module.css';
import StatsPanel from '../../components/StatsPanel/StatsPanel';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { data, fetchSearchTicker, loading } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { useParams } from 'react-router';

const CompanyStatsScreen: React.FC = () => {
    const { ticker } = useParams<any>();
    const tickerData = useSelector(data);
    const loadTickerData = useSelector(loading);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchSearchTicker(ticker))
    }, [ticker, dispatch])

    return (
        <section className={classes.CompanyStatsScreen}>
            <div className={classes.TickerDetails}>
                <h1 className={classes.CompanyName}>{loadTickerData ? null : tickerData.results[0].name + ' ' + `(${tickerData.results[0].ticker})`}</h1>
            </div>
            <StatsPanel />
        </section>
    );
};

export default CompanyStatsScreen;

