import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import FinancialSection from '../../components/FinancialSection/FinancialSection';
import classes from './FinancialStatementScreen.module.css';

type PathParamsType = {
    ticker: string,
    reportType: string,
}

type PropsType = RouteComponentProps<PathParamsType> & {
    ticker: string,
    reportType: string,
}

class FinancialStatementScreen extends Component<PropsType> {
    render() {
        return (
            <section className={classes.FinancialStatementScreen}>
                <FinancialSection reportType={this.props.match.params.reportType} ticker={this.props.match.params.ticker} />
            </section>
        );
    };
};

export default withRouter(FinancialStatementScreen);

