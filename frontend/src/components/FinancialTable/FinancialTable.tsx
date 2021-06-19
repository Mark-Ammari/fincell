import React from 'react';
import classes from './FinancialTable.module.css';
import Tablet from '../Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import Numeral from 'numeral';
import PeriodDropdown from '../PeriodDropdown/PeriodDropdown';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFinancialStatement, financialStatementData, loadFinancialStatement } from '../../reduxStore/getFinancialStatement/getFinancialStatement';
import { useParams } from 'react-router-dom';
import { valueOfPeriod } from '../../reduxStore/period/period';

interface FinancialTableProps {
    reportType?: string,
    width?: string,
}

const FinancialTable: React.FC<FinancialTableProps> = ({ reportType }) => {

    const loadingFinancialStatement = useSelector(loadFinancialStatement)
    const match = useMediaQuery('(min-width:1366px)')
    const changePeriod = useSelector(valueOfPeriod)
    
    const dispatch = useDispatch()

    const { ticker } = useParams<any>() 
    useEffect(() => {
        dispatch(fetchFinancialStatement(ticker, reportType as string, changePeriod))
    }, [ticker, reportType, changePeriod])

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>{reportType?.split("-").join(" ")}</h1>
                <PeriodDropdown />
            </div>
            <div className={classes.FinancialSection}>
                {loadingFinancialStatement ? <div className={classes.Loader}></div> : match ?
                    <FinancialTableDesktop />
                    :
                    <FinancialTableMobile />
                }
            </div>
        </div>
    );
};

const FinancialTableDesktop: React.FC<FinancialTableProps> = ({ width }) => {
    const data = useSelector(financialStatementData)
    return (
        <List className={classes.FinancialTable}>
            {
                data?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            {
                                item["data"].map((value: any, j: number) => {
                                    return <p key={j} style={{ width: width }} className={classes.Value}>{isNaN(value) ? value : Numeral(value).format("0.00a")}</p>
                                })
                            }
                        </div>
                    </ListItem>
                })
            }
        </List>
    );
};

const FinancialTableMobile: React.FC = () => {
    const data = useSelector(financialStatementData)
    const [activeStep, setActiveStep] = React.useState(0);

    return (
        <List className={classes.FinancialTable}>
            <Tablet
                activeStep={activeStep}
                steps={data[0]["data"].length}
                handleNext={() => {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                }}
                handleBack={() => {
                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                }}
                disableBack={activeStep === 0}
                disableNext={activeStep === data[0]["data"].length - 1}
            />
            {
                data?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{isNaN(item["data"][activeStep]) ? item["data"][activeStep] : Numeral(item["data"][activeStep]).format("0.00a")}</p>
                        </div>
                    </ListItem>
                })
            }
        </List>
    );
};


export default FinancialTable;