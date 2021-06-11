import { Paper, useMediaQuery } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchTickerdata } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { loadFinancialStatement, financialStatementdata, fetchFinancialStatement } from '../../reduxStore/getFinancialStatement/getFinancialStatement';
import Tablet from '../Tablet/Tablet';
import classes from './FinancialSection.module.css';

interface FinancialSectionProps {
    reportType: string,
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ reportType }) => {
    const dispatch = useDispatch();
    const tickerData = useSelector(searchTickerdata)
    const loadFinancials = useSelector(loadFinancialStatement)

    useEffect(() => {
        dispatch(fetchFinancialStatement(reportType, tickerData.results[0]["performanceId"]))
    }, [tickerData, dispatch, reportType])

    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>{reportType.replace(/([a-z])([A-Z])/g, '$1 $2')}</h1>
                <p className={classes.RoundNumbers}>All Numbers in the Billions.</p>
            </div>
            <Paper elevation={2} className={classes.FinancialSection}>
                {loadFinancials ?
                    <div className={classes.Loader}></div>
                    :
                    match ? <FinancialSectionDesktop /> : <FinancialSectionMobile />
                }
            </Paper>
        </div>
    );
};

const FinancialSectionDesktop: React.FC = () => {
    const financialsData = useSelector(financialStatementdata)
    return (
        <div className={classes.FinancialTable}>
            {financialsData.map((item: any, index: number) => {
                return <div className={classes.FinancialRow} key={index}>
                    <p title={item["title"]} className={classes.Title}>{item["title"]}</p>
                    {item["data"].map((data: any, position: number) => {
                        return <p className={classes.Value} key={position}>{data || "—"}</p>
                    })}
                </div>
            })}
        </div>
    );
}



const FinancialSectionMobile: React.FC = () => {
    const financialsData = useSelector(financialStatementdata)
    const [activeStep, setActiveStep] = React.useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className={classes.FinancialTable}>
            <Tablet
                activeStep={activeStep}
                steps={financialsData[0]["data"].length}
                handleNext={handleNext}
                handleBack={handleBack}
                disableBack={activeStep === 0}
                disableNext={activeStep === financialsData[0]["data"].length - 1}
            />
            {financialsData.map((item: any, index: number) => {
                return <div className={classes.FinancialRow} key={index}>
                    <p title={item["data"]} className={classes.Title}>{item["title"]}</p>
                    <p className={classes.Value}>{item["data"][activeStep] || "—"}</p>
                </div>
            })}
        </div>
    );
}

export default FinancialSection;