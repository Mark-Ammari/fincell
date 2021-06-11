import { Paper, useMediaQuery } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOperatingPerformance, loadOperatingPerformance, operatingPerformancedata } from '../../reduxStore/getOperatingPerformance/getOperatingPerformance';
import { searchTickerdata } from '../../reduxStore/getSearchTicker/getSearchTicker'
import { fetchValuation, loadValuation, valuationData } from '../../reduxStore/getValuation/getValuation';
import Tablet from '../Tablet/Tablet';
import classes from './KeyRatiosSection.module.css';

const KeyRatiosSection: React.FC = () => {
    const dispatch = useDispatch();
    const performanceId = useSelector(searchTickerdata);

    useEffect(() => {
        dispatch(fetchValuation(performanceId.results[0]["performanceId"]))
        dispatch(fetchOperatingPerformance(performanceId.results[0]["performanceId"]))
    }, [dispatch, performanceId])

    const loadValuations = useSelector(loadValuation);
    const loadOperatingPerformances = useSelector(loadOperatingPerformance)
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Key Ratios</h1>
            </div>
            {loadValuations || loadOperatingPerformances ?
                <div className={classes.Loader}></div>
                :
                match ? <KeyRatiosDesktop /> : <KeyRatiosMobile />
            }
        </div>
    );
};

const KeyRatiosDesktop: React.FC = () => {
    const valuations = useSelector(valuationData);
    const operatingPerformances = useSelector(operatingPerformancedata)

    return (
        <div className={classes.KeyRatiosContainer}>
            <Paper elevation={2} className={classes.KeyRatiosChart}>
                {
                    valuations.map((item: any, i: number) => {
                        return <div className={classes.Data} >
                            <p className={classes.Title}>{item.title}</p>
                            {
                                item.data.slice(3, 13).map((data: any, j: number) => {
                                    return <p className={classes.Value}>{data || 0}</p>
                                })
                            }
                        </div>
                    })
                }
            </Paper>
            <Paper elevation={2} className={classes.KeyRatiosChart}>
                {
                    operatingPerformances.map((item: any, i: number) => {
                        return <div className={classes.Data}>
                            <p className={classes.Title}>{item.title}</p>
                            {
                                item.data.slice(3).map((data: any, j: number) => {
                                    return <p className={classes.Value}>{data || 0}</p>
                                })
                            }
                        </div>
                    })
                }
            </Paper>
        </div>
    )
}

const KeyRatiosMobile: React.FC = () => {
    const valuations = useSelector(valuationData);
    const operatingPerformances = useSelector(operatingPerformancedata)

    const [vActiveStep, setVActiveStep] = React.useState(0);
    const [opActiveStep, setOPActiveStep] = React.useState(0);

    return (
        <div className={classes.KeyRatiosContainer}>
            <Paper elevation={2} className={classes.KeyRatiosChart}>
                <Tablet
                    activeStep={vActiveStep}
                    steps={valuations[0]["data"].length}
                    handleNext={() => {
                        setVActiveStep((prevVActiveStep) => prevVActiveStep + 1)
                    }}
                    handleBack={() => {
                        setVActiveStep((prevVActiveStep) => prevVActiveStep - 1)
                    }}
                    disableBack={vActiveStep === 0}
                    disableNext={vActiveStep === valuations[0]["data"].length - 1}
                />
                {
                    valuations.map((item: any, i: number) => {
                        return <div className={classes.Data} >
                            <p className={classes.Title}>{item.title}</p>
                            <p className={classes.Value}>{item.data[vActiveStep] === "NaN" ? 0 : item.data[vActiveStep]}</p>
                        </div>
                    })
                }
            </Paper>
            <Paper elevation={2} className={classes.KeyRatiosChart}>
                <Tablet
                    activeStep={opActiveStep}
                    steps={operatingPerformances[0]["data"].length}
                    handleNext={() => {
                        setOPActiveStep((prevOPActiveStep) => prevOPActiveStep + 1)
                    }}
                    handleBack={() => {
                        setOPActiveStep((prevOPActiveStep) => prevOPActiveStep - 1)
                    }}
                    disableBack={opActiveStep === 0}
                    disableNext={opActiveStep === operatingPerformances[0]["data"].length - 1}
                />
                {
                    operatingPerformances.map((item: any, i: number) => {
                        return <div className={classes.Data}>
                            <p className={classes.Title}>{item.title}</p>
                            <p className={classes.Value}>{item.data[opActiveStep] === "NaN" ? 0 : item.data[opActiveStep]}</p>
                        </div>
                    })
                }
            </Paper>
        </div>
    )
}

export default KeyRatiosSection;