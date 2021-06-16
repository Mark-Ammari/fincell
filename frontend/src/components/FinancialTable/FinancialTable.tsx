import React from 'react';
import classes from './FinancialTable.module.css';
import Tablet from '../Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import Numeral from 'numeral';

interface FinancialTableProps {
    reportType?: string,
    loading?: boolean,
    data?: any,
    width?: string,
}

const FinancialTable: React.FC<FinancialTableProps> = ({ reportType, loading, data }) => {
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>{reportType?.split("-").join(" ")}</h1>
            </div>
            <div className={classes.FinancialSection}>
                {loading ? <div className={classes.Loader}></div> : match ?
                    <FinancialTableDesktop data={data} />
                    :
                    <FinancialTableMobile data={data} />
                }
            </div>
        </div>
    );
};

const FinancialTableDesktop: React.FC<FinancialTableProps> = ({ data, width }) => {
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

const FinancialTableMobile: React.FC<FinancialTableProps> = ({ data }) => {
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


export default FinancialTable;