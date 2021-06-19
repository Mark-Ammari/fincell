import React from 'react';
import classes from './FinancialStatsTable.module.css';
import Tablet from '../Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import Numeral from 'numeral';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchFinancialStats, financialStatsdata, loadFinancialStats } from '../../reduxStore/getFinancialStats/getFinancialStats';

interface FinancialStatsTableProps {
    reportType?: string,
    width?: string,
}

const FinancialStatsTable: React.FC<FinancialStatsTableProps> = ({ reportType }) => {
    const loadingFinancialStats = useSelector(loadFinancialStats)
    const match = useMediaQuery('(min-width:1366px)')
    
    const dispatch = useDispatch()

    const { ticker } = useParams<any>() 
    useEffect(() => {
        dispatch(fetchFinancialStats(ticker))
    }, [ticker])

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>{reportType?.split("-").join(" ")}</h1>
            </div>
            <div className={classes.FinancialSection}>
                {loadingFinancialStats ? <div className={classes.Loader}></div> : match ?
                    <FinancialStatsTableDesktop />
                    :
                    <FinancialStatsTableMobile />
                }
            </div>
        </div>
    );
};

const FinancialStatsTableDesktop: React.FC<FinancialStatsTableProps> = ({ width }) => {
    const data = useSelector(financialStatsdata)
    return (
        <List className={classes.FinancialTable}>
            {
                data?.map((item: any, i: number) => {
                    return <ListItem className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
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

const FinancialStatsTableMobile: React.FC = () => {
    const data = useSelector(financialStatsdata)
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
                    return <ListItem className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
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


export default FinancialStatsTable;