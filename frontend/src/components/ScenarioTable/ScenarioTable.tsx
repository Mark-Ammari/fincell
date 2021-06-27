import { List, ListItem } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { fairValueData } from '../../reduxStore/getFairValue/getFairValue';
import classes from './ScenarioTable.module.css';

const ScenarioTable: React.FC = () => {
    const data = useSelector(fairValueData)[5][0]
    const date = new Date().getFullYear()
    const timeline = [0,0,0,0,0,0,0,0,0,0,0].map((d: number, i: number) => {
        return date + i
    })
    console.log(timeline)
    const discountRate = 10
    console.log(data)

    return (
        <List className={classes.FinancialTable}>
            <ListItem className={[classes.FinancialRow, classes.Highlight].join(" ")}>
                <p className={classes.Title}>Best Case Scenario</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>1Y</p>
                    <p className={classes.Value}>3Y</p>
                    <p className={classes.Value}>5Y</p>
                    <p className={classes.Value}>10Y</p>
                </div>
            </ListItem>
            <ListItem button className={[classes.FinancialRow, classes.Bold].join(" ")}>
                <p className={classes.Title}>Timeline: {date}</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>{date+1}</p>
                    <p className={classes.Value}>{date+3}</p>
                    <p className={classes.Value}>{date+5}</p>
                    <p className={classes.Value}>{date+10}</p>
                </div>
            </ListItem>
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>Discounted Cash Flow</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>1Y</p>
                    <p className={classes.Value}>3Y</p>
                    <p className={classes.Value}>5Y</p>
                    <p className={classes.Value}>10Y</p>
                </div>
            </ListItem>
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>Net Present Value</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>1Y</p>
                    <p className={classes.Value}>3Y</p>
                    <p className={classes.Value}>5Y</p>
                    <p className={classes.Value}>10Y</p>
                </div>
            </ListItem>
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>Market Cap</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>1Y</p>
                    <p className={classes.Value}>3Y</p>
                    <p className={classes.Value}>5Y</p>
                    <p className={classes.Value}>10Y</p>
                </div>
            </ListItem>
            <ListItem button className={classes.FinancialRow}>
                <p className={classes.Title}>Stock Price</p>
                <div className={classes.ValueRow}>
                    <p className={classes.Value}>1Y</p>
                    <p className={classes.Value}>3Y</p>
                    <p className={classes.Value}>5Y</p>
                    <p className={classes.Value}>10Y</p>
                </div>
            </ListItem>
        </List>
    )
};

export default ScenarioTable;