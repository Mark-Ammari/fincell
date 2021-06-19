import React from 'react';
import classes from './KeyStatsTable.module.css';
import Tablet from '../Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import Numeral from 'numeral';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchKeyStats, keyStatsdata, loadKeyStats } from '../../reduxStore/getKeyStats/getKeyStats';

interface KeyStatsTableProps {
    reportType?: string,
    width?: string,
}

const KeyStatsTable: React.FC<KeyStatsTableProps> = ({ reportType }) => {
    const loadingKeyStats = useSelector(loadKeyStats)
    const match = useMediaQuery('(min-width:1366px)')
    
    const dispatch = useDispatch()

    const { ticker } = useParams<any>() 
    useEffect(() => {
        dispatch(fetchKeyStats(ticker))
    }, [ticker])

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>{reportType?.split("-").join(" ")}</h1>
            </div>
            <div className={classes.FinancialSection}>
                {loadingKeyStats ? <div className={classes.Loader}></div> : match ?
                    <KeyStatsTableDesktop />
                    :
                    <KeyStatsTableMobile />
                }
            </div>
        </div>
    );
};

const KeyStatsTableDesktop: React.FC<KeyStatsTableProps> = ({ width }) => {
    const data = useSelector(keyStatsdata)
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

const KeyStatsTableMobile: React.FC = () => {
    const data = useSelector(keyStatsdata)
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


export default KeyStatsTable;