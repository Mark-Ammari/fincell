import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab, useTheme, AppBar, Box, Typography, Divider } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import classes from './StatsPanel.module.css';
import QuoteSection from '../Quote/QuoteSection';
import FairValueSection from '../FairValueSection/FairValueSection';
import FinancialTable from '../FinancialTable/FinancialTable';
import FinancialStatsTable from '../FinancialStatsTable/FinancialStatsTable';
import KeyStatsTable from '../KeyStatsTable/KeyStatsTable';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        backgroundColor: "white",
        color: "white",
        width: "100%",
        overflowX: "hidden",
        boxShadow: "none",
    },
    tabs: {
        background: "#000",
        color: "#000",
    },
    tabRoot: {
        fontFamily: "'Montserrat', sans-serif",
        textTransform: "capitalize",
        fontWeight: "bold",
        fontSize: "12pt"
    },
    defaultColor: {
        color: "#767676"
    },
    activeColor: {
        color: "#000"
    },
    box: {
        padding: "0 0 5px 0",
        overflowX: "hidden"
    }
});

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const styles = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className={styles.box} p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index: any) => {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const StatsPanel = () => {
    const styles = useStyles();
    const [value, setValue] = React.useState(0);

    const theme = useTheme();
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <div className={classes.StatsPanel}>
            <AppBar position="static" className={styles.root}>
                <Tabs
                    classes={{ indicator: styles.tabs }}
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                    scrollButtons="auto"

                >
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor,
                            root: styles.tabRoot
                        }}
                        label="Metrics"
                        {...a11yProps(0)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor,
                            root: styles.tabRoot
                        }}
                        label="Key Ratios"
                        {...a11yProps(1)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor,
                            root: styles.tabRoot
                        }}
                        label="Income Statement"
                        {...a11yProps(2)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor,
                            root: styles.tabRoot
                        }}
                        label="Balance Sheet"
                        {...a11yProps(3)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor,
                            root: styles.tabRoot
                        }}
                        label="Cash Flows"
                        {...a11yProps(4)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor,
                            root: styles.tabRoot
                        }}
                        label="Fair Value Analysis"
                        {...a11yProps(5)}
                    />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <QuoteSection />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <FinancialStatsTable reportType="key-ratios"/>
                    <Divider />
                    <KeyStatsTable />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <FinancialTable reportType="Income-statement" />
                    <Divider />
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <FinancialTable reportType="balance-sheet" />
                    <Divider />
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <FinancialTable reportType="cash-flow" />
                    <Divider />
                </TabPanel>
                <TabPanel value={value} index={5} dir={theme.direction}>
                    <FairValueSection />
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}

export default StatsPanel;