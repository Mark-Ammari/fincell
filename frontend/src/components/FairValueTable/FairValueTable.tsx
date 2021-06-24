import React from 'react';
import classes from './FairValueTable.module.css';
import Tablet from '../Tablet/Tablet';
import { useMediaQuery, List, ListItem } from '@material-ui/core';
import Numeral from 'numeral';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fairValueData, fetchFairValue, loadFairValue } from '../../reduxStore/getFairValue/getFairValue';
import { searchTickerdata } from '../../reduxStore/getSearchTicker/getSearchTicker';

interface FairValueTableProps {
    reportType?: string,
    width?: string,
}

const FairValueTable: React.FC<FairValueTableProps> = ({ reportType }) => {
    const loadingFairValue = useSelector(loadFairValue)
    const match = useMediaQuery('(min-width:1366px)')
    const performanceId = useSelector(searchTickerdata)["results"][0]["performanceId"]
    const dispatch = useDispatch()

    const { ticker } = useParams<any>()
    useEffect(() => {
        dispatch(fetchFairValue(ticker, performanceId))
    }, [ticker, performanceId])

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Stock Analyzer</h1>
            </div>
            <div className={classes.FinancialSection}>
                {loadingFairValue ? <div className={classes.Loader}></div> : match ?
                    <FairValueTableDesktop />
                    :
                    null
                }
            </div>
        </div>
    );
};

const FairValueTableDesktop: React.FC = () => {
    const data = useSelector(fairValueData)
    console.log(data)
    return (
        <List className={classes.FinancialTable}>
            {
                data[3]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{isNaN(item["TTM"]) ? item["TTM"] : `${item["TTM"]}%`}</p>
                            <p className={classes.Value}>{isNaN(item["firstYear"]) ? item["firstYear"] : `${item["firstYear"]}%`}</p>
                            <p className={classes.Value}>{isNaN(item["threeYearAVG"]) ? item["threeYearAVG"] : `${item["threeYearAVG"]}%`}</p>
                            <p className={classes.Value}>{isNaN(item["fiveYearAVG"]) ? item["fiveYearAVG"] : `${item["fiveYearAVG"]}%`}</p>
                            <p className={classes.Value}>{isNaN(item["tenYearAVG"]) ? item["tenYearAVG"] : `${item["tenYearAVG"]}%`}</p>
                        </div>
                    </ListItem>
                })
            }
            {
                data[1]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{item["TTM"]}</p>
                            <p className={classes.Value}>—</p>
                            <p className={classes.Value}>—</p>
                            <p className={classes.Value}>{item["fiveYearAVG"]}</p>
                            <p className={classes.Value}>—</p>
                        </div>
                    </ListItem>
                })
            }
            {
                data[2]?.map((item: any, i: number) => {
                    return <ListItem button={!item["highlight"] as any} className={[classes.FinancialRow, item["highlight"] ? classes.Highlight : "", item["bold"] ? classes.Bold : ""].join(" ")} key={i}>
                        <p style={{ marginLeft: item["margin"] ? "1.5em" : 10 }} className={classes.Title}>{item["title"]}</p>
                        <div className={classes.ValueRow}>
                            <p className={classes.Value}>{item["TTM"]}</p>
                            <p className={classes.Value}>—</p>
                            <p className={classes.Value}>—</p>
                            <p className={classes.Value}>{item["fiveYearAVG"]}</p>
                            <p className={classes.Value}>—</p>
                        </div>
                    </ListItem>
                })
            }
        </List>
    );
};

const FairValueTableMobile: React.FC = () => {
    const data = useSelector(fairValueData)
    const [activeStep, setActiveStep] = React.useState(0);

    return (
        <List className={classes.FinancialTable}>
            {/* <Tablet
                activeStep={activeStep}
                steps={data[2]["data"].length}
                handleNext={() => {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1)
                }}
                handleBack={() => {
                    setActiveStep((prevActiveStep) => prevActiveStep - 1)
                }}
                disableBack={activeStep === 0}
                disableNext={activeStep === data[2]["data"].length - 1}
            /> */}
            {
                data[2]?.map((item: any, i: number) => {
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


export default FairValueTable;