import React from 'react';
import FairValueTable from './FairValueTable/FairValueTable';
import classes from './FairValue.module.css';
import IntrinsicValueAnalyzer from './IntrinsicValueAnalyzer/IntrinsicValueAnalyzer';
import { useEffect } from 'react';
import { error, fairValueData, fetchFairValue, loadFairValue } from '../../reduxStore/getFairValue/getFairValue';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchTickerdata } from '../../reduxStore/getSearchTicker/getSearchTicker';
import ErrorWrapper from '../../components/ErrorWrapper/ErrorWrapper';

const FairValue: React.FC = () => {
    const loadingFairValue = useSelector(loadFairValue)
    const performanceId = useSelector(searchTickerdata)["results"][0]["performanceId"]
    const fairValueError = useSelector(error)
    const dispatch = useDispatch()
    const { ticker } = useParams<any>()

    useEffect(() => {
        dispatch(fetchFairValue(ticker, performanceId))
    }, [ticker, performanceId, dispatch])

    return (
        <section className={classes.FairValue}>
            {loadingFairValue ? <div className={classes.Loader}></div> :
                <ErrorWrapper error={fairValueError} message="Cannot use the Fair Value Analyzer for this stock.">
                    <FairValueTable />
                    <IntrinsicValueAnalyzer />
                </ErrorWrapper>
            }
        </section>
    )
};

export default FairValue;