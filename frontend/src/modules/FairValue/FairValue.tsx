import React from 'react';
import FairValueTable from './FairValueTable/FairValueTable';
import classes from './FairValue.module.css';
import IntrinsicValueAnalyzer from './IntrinsicValueAnalyzer/IntrinsicValueAnalyzer';

const FairValue: React.FC = () => {
    return (
        <section className={classes.FairValue}>
            <FairValueTable />
            <IntrinsicValueAnalyzer />
        </section>
    )
};

export default FairValue;