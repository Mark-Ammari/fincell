import { Paper, useMediaQuery } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { data, fetchFinancialStatement, loading } from '../../reduxStore/getFinancialStatement/getFinancialStatement';
import ReportType from '../ReportType/ReportType';
import Tablet from '../Tablet/Tablet';
import classes from './FinancialSection.module.css';

interface FinancialSectionProps {
    reportType: string,
    ticker: string
}

const FinancialSection: React.FC<FinancialSectionProps> = ({ reportType, ticker }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchFinancialStatement(reportType, ticker))
    }, [reportType, ticker, dispatch])

    const loadFinancials = useSelector(loading)
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.Ticker}>{ticker}</h1>
                <h1 className={classes.ReportType}>{reportType.replaceAll("-", " ")}</h1>
                <ReportType />
                <p className={classes.RoundNumbers}>All Numbers in the Millions.</p>
            </div>
            <div className={classes.FinancialSection}>
                {loadFinancials ?
                    <div className={classes.Loader}></div>
                    :
                    match ? <FinancialSectionDesktop /> : <FinancialSectionMobile />
                }
            </div>
        </div>
    );
};

const FinancialSectionDesktop: React.FC = () => {
    const financialData = useSelector(data);

    return (
        <div className={classes.FinancialTable}>
            {financialData.map((item: any, index: number) => {
                return <div className={classes.FinancialRow} key={index}>
                    <p title={item["title"]} className={classes.Title}>{item["title"]}</p>
                    {item["list"].map((data: any, position: number) => {
                        return <p className={classes.Value} key={position}>{data}</p>
                    })}
                </div>
            })}
        </div>
    );
}

const FinancialSectionMobile: React.FC = () => {
    const financialData = useSelector(data);
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
                steps={financialData[0]["list"].length}
                handleNext={handleNext}
                handleBack={handleBack}
                disableBack={activeStep === 0}
                disableNext={activeStep === financialData[0]["list"].length - 1}
            />
            {financialData.map((item: any, index: number) => {
                return <div className={classes.FinancialRow} key={index}>
                    <p title={item["title"]} className={classes.Title}>{item["title"]}</p>
                    <p className={classes.Value}>{item["list"][activeStep]}</p>
                </div>
            })}
        </div>
    );
}

export default FinancialSection;