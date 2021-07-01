import React from 'react';
import classes from './IntrinsicValueAnalyzer.module.css';
import { InputAdornment, List, TextField, makeStyles,Divider, ListItem } from '@material-ui/core';

const IntrinsicValueAnalyzer: React.FC = () => {

  return (
    <>
      <List className={classes.ScenarioTable}>
        <ListItem className={[classes.ScenarioRow, classes.Highlight].join(" ")}>
          <p className={classes.Title}>Scenario</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>Worst</p>
            <p className={classes.Value}>Normal</p>
            <p className={classes.Value}>Best</p>
          </div>
        </ListItem>
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>1Y - 5Y Growth</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>5Y - 10Y Growth</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Discount Rate</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Terminal Multiple</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Market Cap</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>-</p>
            <p className={classes.Value}>-</p>
            <p className={classes.Value}>-</p>
          </div>
        </ListItem>
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Stock Price</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>-</p>
            <p className={classes.Value}>-</p>
            <p className={classes.Value}>-</p>
          </div>
        </ListItem>
      </List>
    </>
  );
}

const useStyles = makeStyles({
  root: {
    margin: "0 10px 0 0",
    padding: 0,
    width: 90,
    fontSize: 10
  }
})


interface InputFieldProps {
  label: string,
  variant: "standard" | "filled" | "outlined",
  margin: "dense" | "none" | "normal",
  helperText: string,
  adornment?: string
}

const InputField: React.FC<InputFieldProps> = ({ label, variant, margin, helperText, adornment }) => {
  const styles = useStyles()
  return (
    <TextField
      className={styles.root}
      label={label}
      variant={variant}
      margin={margin}
      helperText={helperText}
      InputProps={{
        endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>,
      }}
    />
  )
}

export default IntrinsicValueAnalyzer;