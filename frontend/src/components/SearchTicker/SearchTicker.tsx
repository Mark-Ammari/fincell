import React, { useEffect, useRef } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { List, InputBase, ListItemText, ListItem, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { searchTickerdata, fetchSearchTicker, loadSearchTicker, searchTickerError } from '../../reduxStore/getSearchTicker/getSearchTicker';
import { useHistory } from 'react-router';
import classes from './SearchTicker.module.css';

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
            color: "black",
            widith: "100%",
            paddingLeft: "1em",
            borderBottom: "1px solid black"
        }
    }),
);

export default function SearchTicker() {
    const styles = useStyles();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState("");
    const [show, setShow] = React.useState(false);
    const ref = useRef<string>();
    const tickerData = useSelector(searchTickerdata);
    const loadTickerData = useSelector(loadSearchTicker);
    const error = useSelector(searchTickerError)
    const history = useHistory()

    const handleSearch = (ticker: string, performanceId: string) => {
        history.push({
            pathname: `/stocks/${ticker}/${performanceId}`,
        })
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
        <div className={classes.SearchTicker}>
            <InputBase
                ref={ref}
                placeholder="Search Ticker..."
                value={value}
                onChange={handleChange}
                fullWidth
                className={styles.textField}
            />
            {show ?
                <List>
                    {loadTickerData ? <div></div> : error ? <p>Cannot Load Ticker</p> :
                        tickerData.results.map((t: any, index: number) => {
                            return <ListItem key={index} button onClick={() => handleSearch(t["ticker"], t["performanceId"])} >
                                <ListItemText primary={t["name"]} secondary={t["ticker"]} />
                            </ListItem>
                        })
                    }
                </List>
                :
                null
            }
        </div>
    );
}