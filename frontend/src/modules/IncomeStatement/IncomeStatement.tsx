import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ErrorWrapper from '../../components/ErrorWrapper/ErrorWrapper';
import GenericTable from '../../components/GenericTable/GenericTable';
import { error, fetchFinancialStatement, financialStatementData, loadFinancialStatement } from '../../reduxStore/getFinancialStatement/getFinancialStatement';
import { valueOfPeriod } from '../../reduxStore/period/period';

const IncomeStatement: React.FC = () => {
    const dispatch = useDispatch()
    const { ticker } = useParams<any>()
    const data = useSelector(financialStatementData)
    const financialStatementError = useSelector(error)
    const loadData = useSelector(loadFinancialStatement)
    const changePeriod = useSelector(valueOfPeriod)
    useEffect(() => {
        dispatch(fetchFinancialStatement(ticker, "income-statement", changePeriod))
    }, [dispatch, ticker, changePeriod])

    return (
        <ErrorWrapper error={financialStatementError} message="Cannot Load Table.">
            <GenericTable hasDropdown loader={loadData} data={data} reportType="Income Statement" />
        </ErrorWrapper>
    )
};

export default IncomeStatement