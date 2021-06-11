import { Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchChartData } from '../../reduxStore/getChartData/getChartData';
import { fetchQuote, loading as loadingQuote, data as quoteData } from '../../reduxStore/getQuote/getQuote';
import { searchTickerdata } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { data as chartData, loading as loadingChartData } from '../../reduxStore/getChartData/getChartData';
import StockChart from '../StockChart/StockChart';
import classes from './QuoteSection.module.css';

const QuoteSection: React.FC = () => {
    const dispatch = useDispatch();
    const performanceId = useSelector(searchTickerdata);
    const { ticker } = useParams<any>()

    useEffect(() => {
        dispatch(fetchQuote(performanceId.results[0]["performanceId"]))
        dispatch(fetchChartData(ticker, "6M"))
    }, [dispatch, performanceId, ticker])

    const loadQuote = useSelector(loadingQuote);
    const loadChartData = useSelector(loadingChartData)

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Metrics</h1>
            </div>
            {loadQuote || loadChartData ?
                <div className={classes.Loader}></div>
                :
                <Chart />
            }
        </div>
    );
};

const Chart: React.FC = () => {
    const quote = useSelector(quoteData);
    const chart = useSelector(chartData)

    return (
        <div className={classes.QuoteContainer}>
            <StockChart data={chart} />
            <Paper>

            </Paper>
        </div>
    )
}

export default QuoteSection;