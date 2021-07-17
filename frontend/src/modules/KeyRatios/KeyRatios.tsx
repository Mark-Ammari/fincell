import React, { useEffect } from 'react';
import classes from './KeyRatios.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import GenericTable from '../../components/GenericTable/GenericTable';
import { error as fsError, fetchFinancialStats, financialStatsdata, loadFinancialStats } from '../../reduxStore/getFinancialStats/getFinancialStats';
import { error as ksError, fetchKeyStats, keyStatsdata, loadKeyStats } from '../../reduxStore/getKeyStats/getKeyStats';
import ErrorWrapper from '../../components/ErrorWrapper/ErrorWrapper';

const KeyRatios: React.FC = () => {
    const dispatch = useDispatch()
    const { ticker, performanceId } = useParams<any>()
    const financialStats = useSelector(financialStatsdata)
    const loadingFinancialStats = useSelector(loadFinancialStats)

    const keyStats = useSelector(keyStatsdata)
    const loadingKeyStats = useSelector(loadKeyStats)
    const financialStatsError = useSelector(fsError)
    const keyStatsError = useSelector(ksError)

    useEffect(() => {
        dispatch(fetchFinancialStats(ticker))
        dispatch(fetchKeyStats(ticker))
    }, [dispatch, ticker, performanceId])

    return (
        <ErrorWrapper error={financialStatsError || keyStatsError} message="Cannot Load Table.">
            <GenericTable width="90px" loader={loadingFinancialStats} data={financialStats} reportType="Financial Stats" />
            <GenericTable width="90px" loader={loadingKeyStats} data={keyStats} reportType="Key Stats" />
        </ErrorWrapper>
    )
};

export default KeyRatios