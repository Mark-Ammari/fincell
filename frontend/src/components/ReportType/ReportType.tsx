import React from 'react';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import classes from './ReportType.module.css';

const ReportType: React.FC = () => {
    const params = useParams<{ticker: string}>()
    console.log(useHistory().location)
    return (
        <div className={classes.ReportType}>
            <NavLink activeClassName={classes.ActiveNavLink} className={classes.NavLink} to={`/stocks/income-statement/${params.ticker}`}>Income</NavLink>
            <span>/</span>
            <NavLink activeClassName={classes.ActiveNavLink} className={classes.NavLink} to={`/stocks/balance-sheet-statement/${params.ticker}`}>Balance Sheet</NavLink>
            <span>/</span>
            <NavLink activeClassName={classes.ActiveNavLink} className={classes.NavLink} to={`/stocks/cash-flow-statement/${params.ticker}`}>Cash Flows</NavLink>
        </div>
    );
};

export default ReportType;