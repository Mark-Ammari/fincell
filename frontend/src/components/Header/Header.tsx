import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import React from 'react';
import classes from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={classes.Header}>
            <Toolbar >
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Fincell
                </Typography>
                <input className={classes.SearchBar} type="text" id="search-bar" name="search-bar" placeholder="Search Ticker..."/>
            </Toolbar>
        </header>
    )
};

export default Header;