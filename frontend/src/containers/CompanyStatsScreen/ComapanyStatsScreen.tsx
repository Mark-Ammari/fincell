import React, { Component } from 'react';
import classes from './CompanyStatsScreen.module.css';
import StatsPanel from '../../components/StatsPanel/StatsPanel';

class CompanyStatsScreen extends Component {
    render() {
        return (
            <section className={classes.CompanyStatsScreen}>
                <StatsPanel />
            </section>
        );
    };
};

export default CompanyStatsScreen;

