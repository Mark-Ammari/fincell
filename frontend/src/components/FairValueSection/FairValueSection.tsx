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
            </div>
            <div className={classes.FinancialSection}>
                <Scenario />
            </div>
        </div>
    );
};

const Scenario: React.FC = () => {
    return (
        <div className={classes.ScenarioTable}>

        </div>
    )
}

export default FairValueSection;