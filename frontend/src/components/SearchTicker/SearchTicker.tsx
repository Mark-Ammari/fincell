import React, { useEffect, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputBase, Dialog, ListItemText, ListItem, List, Divider, AppBar, Toolbar, IconButton, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { CloseRounded, SearchRounded } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { searchTickerdata, fetchSearchTicker, loadSearchTicker } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
            backgroundColor: '#1e1e1e',
            width: "100%",
            padding: "0px"
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        iconButton: {
            color: "white",
            margin: "0 5px"
        },
        textField: {
            color: "white",
            widith: "100%",
            paddingLeft: "1em",
            borderBottom: "1px solid white"
        }
    }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function SearchTicker() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const [value, setValue] = React.useState("");
    const [show, setShow] = React.useState(false);
    const ref = useRef<string>();
    const tickerData = useSelector(searchTickerdata);
    const loadTickerData = useSelector(loadSearchTicker);
    const history = useHistory()

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSearch = (ticker: string) => {
        history.push({
            pathname: `/stocks/${ticker}`,
        })
        handleClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    useEffect(() => {
        ref.current = value
        const timer = setTimeout(() => {
            if (value) {
                if (value === ref.current) {
                    setShow(true)
                    dispatch(fetchSearchTicker(value))
                }
            } else {
                setShow(false)
            }
        }, 500);
        return () => {
            clearTimeout(timer)
        }
    }, [value, ref, dispatch])

    return (
        <div>
            <IconButton className={classes.iconButton} onClick={handleClickOpen}>
                <SearchRounded />
            </IconButton>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseRounded />
                        </IconButton>
                        <InputBase
                            className={classes.textField}
                            fullWidth
                            autoFocus
                            ref={ref}
                            placeholder="Search Ticker..."
                            value={value}
                            onChange={handleChange}
                        />
                    </Toolbar>
                </AppBar>
                {show ?
                    <List>
                        {
                            !loadTickerData ? tickerData.results.map((t: any, index: number) => {
                                return <ListItem key={index} button onClick={() => handleSearch(t["ticker"])} >
                                    <ListItemText primary={t["name"]} secondary={t["ticker"]} />
                                </ListItem>
                            }) : <div></div>
                        }
                    </List>
                    :
                    null
                }
            </Dialog>
        </div>
    );
}