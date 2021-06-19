import React from 'react';
import classes from './FairValueSection.module.css';
import { useMediaQuery } from '@material-ui/core';
import { useSelector } from 'react-redux';
// import { cashFlowdata } from '../../reduxStore/getCashFlow/getCashFlow';

const FairValueSection: React.FC = () => {
    const match = useMediaQuery('(min-width:1366px)')

    return (
        <div className={classes.Container}>
            <div className={classes.Details}>
                <h1 className={classes.ReportType}>Intrinsic Value Analysis</h1>
                {/* <p className={classes.RoundNumbers}>All Numbers in the Billions.</p> */}
            </div>
            <div className={classes.FinancialSection}>
                <Scenario />
            </div>
        </div>
    );
};

const Scenario: React.FC = () => {
    // const freeCashFlow = useSelector(cashFlowdata)[33]["data"]
    // const avgFCF = (parseInt(freeCashFlow[1]) + parseInt(freeCashFlow[1]) + parseInt(freeCashFlow[1]) + parseInt(freeCashFlow[1]) + parseInt(freeCashFlow[1])) / 5
    // console.log(parseInt(freeCashFlow[0]))
    return (
        <div className={classes.ScenarioTable}>

        </div>
    )
}

export default FairValueSection;