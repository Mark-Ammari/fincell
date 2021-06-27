import React from 'react';
import classes from './GenericTable.module.css';
import Tablet from '../Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import Numeral from 'numeral';
import PeriodDropdown from '../PeriodDropdown/PeriodDropdown';

interface GenericTableProps {
    reportType?: string,
    loader?: boolean,
    width?: string,
    hasDropdown?: boolean,
    data?: any
}

const GenericTable: React.FC<GenericTableProps> = ({ reportType, loader, width, hasDropdown, data }) => {
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>{reportType}</h1>
                {hasDropdown ? <PeriodDropdown /> : null}
            </div>
            <div className={classes.GenericSection}>
                {loader ? <div className={classes.Loader}></div>
                    : match ? <GenericTableDesktop data={data} width={width} /> : <GenericTableMobile data={data} />
                }
            </div>
        </div>
    );
};

const GenericTableDesktop: React.FC<GenericTableProps> = ({ data, width }) => {
    return (
        <List className={classes.GenericTable}>
            {
                data?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.GenericRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            {
                                item["data"].map((value: any, j: number) => {
                                    return <p key={j} className={classes.Value} style={{width:width}}>{isNaN(value) ? value : Numeral(value).format("0.00a")}</p>
                                })
                            }
                        </div>
                    </ListItem>
                })
            }
        </List>
    );
};

const GenericTableMobile: React.FC<GenericTableProps> = ({ data }) => {
    const [activeStep, setActiveStep] = React.useState(0);
    return (
        <List className={classes.GenericTable}>
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
                    return <ListItem button={!item["highlight"] as any} className={[classes.GenericRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
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


export default GenericTable;