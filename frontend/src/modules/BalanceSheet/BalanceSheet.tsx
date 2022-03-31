import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ErrorWrapper from '../../components/ErrorWrapper/ErrorWrapper';
import GenericTable from '../../components/GenericTable/GenericTable';
import { fetchFinancialStatement, financialStatementData, loadFinancialStatement, error } from '../../reduxStore/getFinancialStatement/getFinancialStatement';
import { valueOfPeriod } from '../../reduxStore/period/period';
// import classes from './variableName.module.css';

const BalanceSheet: React.FC = () => {
    const dispatch = useDispatch()
    const { ticker } = useParams<any>()
    const data = useSelector(financialStatementData)
    const loadData = useSelector(loadFinancialStatement)
    const changePeriod = useSelector(valueOfPeriod)
    const financialStatementError = useSelector(error)

    useEffect(() => {
        dispatch(fetchFinancialStatement(ticker as string, "balance-sheet", changePeriod))
    }, [dispatch, ticker, changePeriod])

    return (
        <ErrorWrapper error={financialStatementError} message="Cannot Load Table.">
            <GenericTable hasDropdown loader={loadData} data={data} reportType="Balance Sheet" />
        </ErrorWrapper>
    )
};

export default BalanceSheet