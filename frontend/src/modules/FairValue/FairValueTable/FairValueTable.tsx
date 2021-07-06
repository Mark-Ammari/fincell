import React from 'react';
import classes from './FairValueTable.module.css';
import Tablet from '../../../components/Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import { fairValueData } from '../../../reduxStore/getFairValue/getFairValue';
import { useSelector } from 'react-redux';

interface FairValueTableProps {
    reportType?: string,
    width?: string,
}

const FairValueTable: React.FC<FairValueTableProps> = () => {
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Fair Value Analyzer</h1>
            </div>
            <div className={classes.FinancialSection}>
                {match ?
                    <FairValueTableDesktop />
                    :
                    <FairValueTableMobile />
                }
                <KeyInfo />
            </div>
        </div>
    );
};


const FairValueTableDesktop: React.FC = () => {
    const data = useSelector(fairValueData)
    return (
        <List className={classes.FinancialTable}>
            {
                data[3]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{item["TTM"]}</p>
                            <p className={classes.Value}>{item["firstYear"]}</p>
                            <p className={classes.Value}>{item["threeYearAVG"]}</p>
                            <p className={classes.Value}>{item["fiveYearAVG"]}</p>
                            <p className={classes.Value}>{item["tenYearAVG"]}</p>
                        </div>
                    </ListItem>
                })
            }
            {
                data[6]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={classes.FinancialRow} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{item["TTM"]}</p>
                            <p className={classes.Value}>{item["firstYear"]}</p>
                            <p className={classes.Value}>{item["threeYearAVG"]}</p>
                            <p className={classes.Value}>{item["fiveYearAVG"]}</p>
                            <p className={classes.Value}>{item["tenYearAVG"]}</p>
                        </div>
                    </ListItem>
                })
            }
            <ListItem button={!data[1][0]["highlight"] as any} className={[classes.FinancialRow, data[1][0]["highlight"] ? classes.Highlight : "", data[1][0]["bold"] ? classes.Bold : ""].join(" ")}>
                <p style={{ marginLeft: data[1][0]["margin"] ? "1.5em" : 10 }} className={classes.Title}>{data[1][0]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[1][0]["TTM"]}</p>
                    <p className={classes.Value}>—</p>
                    <p className={classes.Value}>—</p>
                    <p className={classes.Value}>{data[1][0]["fiveYearAVG"]}</p>
                    <p className={classes.Value}>—</p>
                </div>
            </ListItem>
            <ListItem button={!data[1][3]["highlight"] as any} className={[classes.FinancialRow, data[1][3]["highlight"] ? classes.Highlight : "", data[1][3]["bold"] ? classes.Bold : ""].join(" ")}>
                <p style={{ marginLeft: data[1][3]["margin"] ? "1.5em" : 10 }} className={classes.Title}>{data[1][3]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[1][3]["TTM"]}</p>
                    <p className={classes.Value}>—</p>
                    <p className={classes.Value}>—</p>
                    <p className={classes.Value}>{data[1][3]["fiveYearAVG"]}</p>
                    <p className={classes.Value}>—</p>
                </div>
            </ListItem>
        </List>
    );
};

const FairValueTableMobile: React.FC = () => {
    const data = useSelector(fairValueData)
    const [activeStep, setActiveStep] = React.useState(0);
    let carousel = data[3][0]["list"][activeStep]
    return (
        <List className={classes.FinancialTable}>
            <Tablet
                activeStep={activeStep}
                steps={5}
                handleNext={() => {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                }}
                handleBack={() => {
                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                }}
                disableBack={activeStep === 0}
                disableNext={activeStep === 5 - 1}
            />
            {
                data[3]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{isNaN(item[carousel]) ? item[carousel] : `${item[carousel]}%`}</p>
                        </div>
                    </ListItem>
                })
            }
            {
                data[6]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{isNaN(item[carousel]) ? item[carousel] : `${item[carousel]}%`}</p>
                        </div>
                    </ListItem>
                })
            }
            <ListItem button={!data[1][0]["highlight"] as any} className={[classes.FinancialRow, data[1][0]["highlight"] ? classes.Highlight : "", data[1][0]["bold"] ? classes.Bold : ""].join(" ")}>
                <p style={{ marginLeft: data[1][0]["margin"] ? "1em" : 10 }} className={classes.Title}>{data[1][0]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[1][0][carousel]}</p>
                </div>
            </ListItem>
            <ListItem button={!data[1][3]["highlight"] as any} className={[classes.FinancialRow, data[1][3]["highlight"] ? classes.Highlight : "", data[1][3]["bold"] ? classes.Bold : ""].join(" ")}>
                <p style={{ marginLeft: data[1][3]["margin"] ? "1em" : 10 }} className={classes.Title}>{data[1][3]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[1][3][carousel]}</p>
                </div>
            </ListItem>
        </List>
    );
};

const KeyInfo: React.FC = () => {
    const data = useSelector(fairValueData)
    return (
        <List className={classes.FinancialTable}>
            <ListItem className={[classes.FinancialRow, classes.Highlight].join(" ")}>
                <p className={classes.Title}>Key Info</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{new Date().getFullYear()}</p>
                </div>
            </ListItem>
            {data[0].map((item: any, i: number) => {
                return <ListItem button key={i} className={classes.FinancialRow}>
                    <p className={classes.Title}>{item["title"]}</p>
                    <div className={classes.ValueRow}>
                        <p className={classes.Value}>{item["formattedValue"]}</p>
                    </div>
                </ListItem>
            })}
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>{data[4][0]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[4][0]["formattedValue"]}</p>
                </div>
            </ListItem>
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>{data[4][2]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[4][2]["formattedValue"]}</p>
                </div>
            </ListItem>
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>{data[4][3]["title"]}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{data[4][3]["formattedValue"]}</p>
                </div>
            </ListItem>
            {data[5].map((item: any, i: number) => {
                return <ListItem button key={i} className={classes.FinancialRow}>
                    <p className={classes.Title}>{item["title"]}</p>
                    <div className={classes.ValueRow}>
                        <p className={classes.Value}>{item["formattedValue"]}</p>
                    </div>
                </ListItem>
            })}
        </List>
    );
};

export default FairValueTable;