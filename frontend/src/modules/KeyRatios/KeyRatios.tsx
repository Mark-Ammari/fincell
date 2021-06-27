import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import GenericTable from '../../components/GenericTable/GenericTable';
import { fetchFinancialStats, financialStatsdata, loadFinancialStats } from '../../reduxStore/getFinancialStats/getFinancialStats';
import { fetchKeyStats, keyStatsdata, loadKeyStats } from '../../reduxStore/getKeyStats/getKeyStats';
import { valueOfPeriod } from '../../reduxStore/period/period';

const KeyRatios: React.FC = () => {
    const dispatch = useDispatch()
    const { ticker, performanceId } = useParams<any>()
    const financialStats = useSelector(financialStatsdata)
    const loadingFinancialStats = useSelector(loadFinancialStats)

    const keyStats = useSelector(keyStatsdata)
    const loadingKeyStats = useSelector(loadKeyStats)
    useEffect(() => {
        dispatch(fetchFinancialStats(ticker))
        dispatch(fetchKeyStats(ticker))
    }, [dispatch, ticker, performanceId])

    return (
        <>
            <GenericTable width="90px" loader={loadingFinancialStats} data={financialStats} reportType="Financial Stats" />
            <GenericTable width="90px" loader={loadingKeyStats} data={keyStats} reportType="Key Stats" />
        </>
    )
};

export default KeyRatios