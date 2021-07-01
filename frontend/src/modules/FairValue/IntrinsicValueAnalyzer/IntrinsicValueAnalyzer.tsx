import React from 'react';
import classes from './IntrinsicValueAnalyzer.module.css';
import { InputAdornment, List, MenuItem, TextField, makeStyles, Divider, ListItem, Button } from '@material-ui/core';

const IntrinsicValueAnalyzer: React.FC = () => {

  return (
    <form noValidate autoComplete="off">
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
          <p className={classes.Title}>Revenue Growth</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Share Buyback/Issuance</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Profit Margin</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>FCF % of Revenue</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Desired P/E</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Desired P/FCF</p>
          <div className={classes.ValueRow}>
            <InputField label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField label="" adornment="" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Market Cap</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>—</p>
            <p className={classes.Value}>—</p>
            <p className={classes.Value}>—</p>
          </div>
        </ListItem>
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Stock Price</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>—</p>
            <p className={classes.Value}>—</p>
            <p className={classes.Value}>—</p>
          </div>
        </ListItem>
      </List>
      <Analyze />
    </form>
  );
}

const useStyles = makeStyles({
  root: {
    margin: "0 10px 0 10px",
    padding: 0,
    width: 90,
    fontSize: 10,
  },
  btn: {
    height: "40px",
    fontFamily: "'Montserrat', sans-serif",
    textTransform: "capitalize",
    fontWeight: "bold",
    margin: "0 10px 0 10px",
  }
})


interface InputFieldProps {
  label: string,
  variant: "standard" | "filled" | "outlined",
  margin: "dense" | "none" | "normal",
  helperText: string,
  adornment?: string,
  width?: string,
  error?: boolean
}

const InputField: React.FC<InputFieldProps> = ({ label, variant, margin, helperText, adornment, width, error }) => {
  const styles = useStyles()
  return (
    <TextField
      className={styles.root}
      style={{ width: width }}
      label={label}
      variant={variant}
      error={error}
      margin={margin}
      helperText={helperText}
      InputProps={{
        endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>,
      }}
    />
  )
}

const SelectField: React.FC = () => {
  const styles = useStyles()
  const [period, setPeriod] = React.useState("1");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(event.target.value);
  };

  return (
    <TextField
      className={styles.root}
      id="outlined-select-period"
      select
      margin="dense"
      label="Outlook"
      value={period}
      onChange={handleChange}
      variant="outlined"
    >
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((year: string, key: number) => {
        return <MenuItem key={key} value={year}>{year}</MenuItem>
      })}
    </TextField>
  );
}

const Analyze: React.FC = () => {
  const styles = useStyles()
  return (
    <>
      <SelectField />
      <InputField label="Discount Rate" helperText="" adornment="%" variant="outlined" width="150px" margin="dense" />
      <Button type="submit" className={styles.btn} variant="outlined">Analyze</Button>
    </>
  )
}



export default IntrinsicValueAnalyzer;