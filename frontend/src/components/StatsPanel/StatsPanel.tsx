import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab, useTheme, AppBar, Box, Typography } from '@material-ui/core';
import FinancialSection from '../FinancialSection/FinancialSection';
import { useParams } from 'react-router';
import SwipeableViews from 'react-swipeable-views';
import classes from './StatsPanel.module.css';
import KeyRatiosSection from '../KeyRatiosSection/KeyRationsSection';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        backgroundColor: "#1e1e1e",
        color: "white",
        overflowX: "hidden"
    },
    tabs: {
        background: "#FFF",
        color: "#FFF",
    },
    defaultColor: {
        color: "#F5F5F5"
    },
    activeColor: {
        color: "#FFF"
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

function TabPanel(props: TabPanelProps) {
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

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function StatsPanel() {
    const styles = useStyles();
    const [value, setValue] = React.useState(0);
    const { ticker } = useParams<any>();

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
                            selected: styles.activeColor
                        }}
                        label="Quote"
                        {...a11yProps(0)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor
                        }}
                        label="Key Ratios"
                        {...a11yProps(1)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor
                        }}
                        label="Income Statement"
                        {...a11yProps(2)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor
                        }}
                        label="Balance Sheet"
                        {...a11yProps(3)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor
                        }}
                        label="Cash Flows"
                        {...a11yProps(4)}
                    />
                    <Tab
                        classes={{
                            textColorInherit: styles.defaultColor,
                            selected: styles.activeColor
                        }}
                        label="DCF Calculator"
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
                    Item One
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <KeyRatiosSection />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <FinancialSection reportType="income-statement" />
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <FinancialSection reportType="balance-sheet-statement" />
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <FinancialSection reportType="cash-flow-statement" />
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}