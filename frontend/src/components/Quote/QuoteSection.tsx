import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { fetchChartData } from '../../reduxStore/getChartData/getChartData';
import { fetchQuote, loadQuote, quoteData } from '../../reduxStore/getQuote/getQuote';
import { searchTickerdata } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { data as chartData, loading as loadingChartData } from '../../reduxStore/getChartData/getChartData';
import classes from './QuoteSection.module.css';
import { List, ListItem } from '@material-ui/core';
import StockChart from '../StockChart/StockChart';

const QuoteSection: React.FC = () => {
    const dispatch = useDispatch();
    const performanceId = useSelector(searchTickerdata);
    const { ticker } = useParams<any>()

    useEffect(() => {
        dispatch(fetchQuote(performanceId.results[0]["performanceId"]))
        dispatch(fetchChartData(ticker as string, "MAX"))
    }, [dispatch, performanceId, ticker])

    const qLoading = useSelector(loadQuote);
    const cLoading = useSelector(loadingChartData)

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Metrics</h1>
            </div>
            {cLoading || qLoading ?
                <div className={classes.Loader}></div>
                :
                <Quotes />
            }
        </div>
    );
};

const Quotes: React.FC = () => {
    const qData = useSelector(quoteData);
    const cData = useSelector(chartData)
    return (
        <>
        <StockChart data={cData}/>
        <List className={classes.QuotesContainer}>
            {Object.keys(qData).map((el: any, i: number) => {

                return <>
                    <ListItem className={classes.Chart}>
                        {
                            qData[el].map((value: any, j: number) => {
                                return <div className={[classes.MetricRows, value["highlight"] ? classes.Highlight : ""].join(" ")}>
                                    <p className={classes.Title}>{value.title}</p>
                                    <p className={classes.Value}>{value.data}</p>
                                </div>
                            })
                        }
                    </ListItem>
                </>
            })}
        </List>
        </>
    )
}

export default QuoteSection;