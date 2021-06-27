import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import GenericTable from '../../components/GenericTable/GenericTable';
import { fetchFinancialStatement, financialStatementData, loadFinancialStatement } from '../../reduxStore/getFinancialStatement/getFinancialStatement';
import { valueOfPeriod } from '../../reduxStore/period/period';
// import classes from './variableName.module.css';

const BalanceSheet: React.FC = () => {
    const dispatch = useDispatch()
    const { ticker } = useParams<any>()
    const data = useSelector(financialStatementData)
    const loadData = useSelector(loadFinancialStatement)
    const changePeriod = useSelector(valueOfPeriod)
    useEffect(() => {
        dispatch(fetchFinancialStatement(ticker, "balance-sheet", changePeriod))
    }, [dispatch, ticker, changePeriod])

    return (
        <GenericTable hasDropdown  loader={loadData} data={data} reportType="Balance Sheet"  />
    )
};

export default BalanceSheet