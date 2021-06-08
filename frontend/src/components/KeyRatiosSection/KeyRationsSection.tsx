import { Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { data as keyRatiosData, fetchKeyRatios, loading } from '../../reduxStore/getKeyRatios/getKeyRatios';
import { data as tickerData } from '../../reduxStore/getSearchTicker/getSearchTicker'
import classes from './KeyRatiosSection.module.css';

const KeyRatiosSection: React.FC = () => {
    const dispatch = useDispatch();
    const performanceId = useSelector(tickerData);

    useEffect(() => {
        dispatch(fetchKeyRatios(performanceId.results[0]["performanceId"]))
    }, [dispatch, performanceId])

    const loadKeyRatios = useSelector(loading)
    // const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Key Ratios</h1>
            </div>
            {loadKeyRatios ?
                <div className={classes.Loader}></div>
                :
                <KeyRatios />
            }
        </div>
    );
};

const KeyRatios: React.FC = () => {
    const ratios = useSelector(keyRatiosData);

    return (
        <div className={classes.KeyRatiosContainer}>
            {
                Object.keys(ratios).map((ratio: any, i: number) => {
                    return <Paper elevation={2} className={classes.KeyRatiosChart}>
                        <p className={classes.Title}>{ratio.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}</p>
                        {
                            Object.keys(ratios[ratio]).slice(1).map((item: any, j: number) => {
                                return <div className={classes.DataPoints}>
                                    <p>{item.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}</p>
                                    <p>{ratios[ratio][item]}</p>
                                </div>
                            })
                        }
                    </Paper>
                })
            }
        </div>
    )
}

export default KeyRatiosSection;