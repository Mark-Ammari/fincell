import React from 'react';
import FairValueTable from './FairValueTable/FairValueTable';
import classes from './FairValue.module.css';

const FairValue: React.FC = () => {
    return (
        <section className={classes.FairValue}>
            <FairValueTable />
        </section>
    )
};

export default FairValue;