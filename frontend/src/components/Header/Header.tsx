import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { Menu, SearchRounded } from '@material-ui/icons';
import React from 'react';
import SearchTicker from '../SearchTicker/SearchTicker';
import classes from './Header.module.css';

const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        backgroundColor: "#1e1e1e",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconButton: {
        color: "white",
        margin: "0 5px"
    }
}));

const Header: React.FC = () => {
    const styles = useStyles()

    return (
        <AppBar className={styles.root} position="static">
            <Toolbar className={styles.toolbar}>
                <IconButton className={styles.iconButton} edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <SearchTicker />
            </Toolbar>
        </AppBar>
    )
};

export default Header;