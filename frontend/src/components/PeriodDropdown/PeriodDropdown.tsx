import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import classes from './PeriodDropdown.module.css';
import { switchPeriod, valueOfPeriod } from '../../reduxStore/period/period';
import { useDispatch, useSelector } from 'react-redux';

export default function PeriodDropdown() {
    const changePeriod = useSelector(valueOfPeriod)
    const dispatch = useDispatch();
    const [period, setPeriod] = React.useState(changePeriod);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPeriod(event.target.value);
    };

    useEffect(() => {
        dispatch(switchPeriod(period))
    }, [dispatch, period])

    return (
        <form className={classes.PeriodDropdown} noValidate autoComplete="off">
            <div className={classes.SelectContainer}>
                <TextField
                    className={classes.SelectField}
                    id="outlined-select-period"
                    select
                    margin="dense"
                    label="Period"
                    value={period}
                    onChange={handleChange}
                    variant="outlined"
                >
                    <MenuItem value="12">Annually</MenuItem>
                    <MenuItem value="3">Quarterly</MenuItem>
                </TextField>
            </div>
        </form>
    );
}