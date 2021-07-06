import React from 'react';
import classes from './IntrinsicValueAnalyzer.module.css';
import { InputAdornment, List, MenuItem, TextField, makeStyles, Divider, ListItem, Button } from '@material-ui/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { fairValueData } from '../../../reduxStore/getFairValue/getFairValue';
import Numeral from 'numeral';

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

const IntrinsicValueAnalyzer: React.FC = () => {
  const styles = useStyles()
  const epsVal = useSelector(fairValueData)[4]
  const fcfVal = useSelector(fairValueData)[5]
  const [dataPoints, setDataPoints] = React.useState({
    worst: {
      revenueGrowth: "0",
      shareChange: "0",
      profitMargin: "0",
      fcfOfRevenue: "0",
      peRatio: "0",
      pfcfRatio: "0"
    },
    normal: {
      revenueGrowth: "0",
      shareChange: "0",
      profitMargin: "0",
      fcfOfRevenue: "0",
      peRatio: "0",
      pfcfRatio: "0"
    },
    best: {
      revenueGrowth: "0",
      shareChange: "0",
      profitMargin: "0",
      fcfOfRevenue: "0",
      peRatio: "0",
      pfcfRatio: "0"
    },
    outlook: "5",
    discountRate: "10"
  })
  const [instrinsicValue, setIntrinsicValue] = useState({
    marketCap: {
      worst: "0",
      normal: "0",
      best: "0"
    },
    stockValue: {
      worst: "0",
      normal: "0",
      best: "0"
    }
  })

  const analyzeHandler = () => {
    let dcfWorst = 0
    let dcfNormal = 0
    let dcfBest = 0

    let epsWorst = 0
    let epsNormal = 0
    let epsBest = 0

    let netIncomeWorst = parseInt(epsVal[0]["rawValue"])
    let cashFlowWorst = parseInt(epsVal[0]["rawValue"])
    let netIncomeNormal = parseInt(epsVal[0]["rawValue"])
    let cashFlowNormal = parseInt(epsVal[0]["rawValue"])
    let netIncomeBest = parseInt(epsVal[0]["rawValue"])
    let cashFlowBest = parseInt(epsVal[0]["rawValue"])

    let wasoWorst = parseInt(epsVal[3]["rawValue"])
    let wasoNormal = parseInt(epsVal[3]["rawValue"])
    let wasoBest = parseInt(epsVal[3]["rawValue"])

    for (let i = 0; i < parseInt(dataPoints.outlook); i++) {
      wasoWorst += (wasoWorst * (parseFloat(dataPoints.worst.shareChange) / 100))
      netIncomeWorst += (netIncomeWorst * (parseFloat(dataPoints.worst.profitMargin) / 100))
      epsWorst += (netIncomeWorst / wasoWorst) / Math.pow((1 + parseFloat(dataPoints.discountRate)), i + 1)

      wasoNormal += (wasoNormal * (parseFloat(dataPoints.normal.shareChange) / 100))
      netIncomeNormal += (netIncomeNormal * (parseFloat(dataPoints.normal.profitMargin) / 100))
      epsNormal += (netIncomeNormal / wasoNormal) / Math.pow((1 + parseFloat(dataPoints.discountRate)), i + 1)

      wasoBest += (wasoBest * (parseFloat(dataPoints.best.shareChange) / 100))
      netIncomeBest += (netIncomeBest * (parseFloat(dataPoints.best.profitMargin) / 100))
      epsBest += (netIncomeBest / wasoBest) / Math.pow((1 + parseFloat(dataPoints.discountRate)), i + 1)
      // -------------------------------------------------------------------------------------------------------
      cashFlowWorst += (cashFlowWorst * (parseFloat(dataPoints.worst.fcfOfRevenue) / 100))
      dcfWorst += cashFlowWorst / Math.pow((1 + parseFloat(dataPoints.discountRate)), i + 1)

      cashFlowNormal += (cashFlowNormal * (parseFloat(dataPoints.normal.fcfOfRevenue) / 100))
      dcfNormal += cashFlowNormal / Math.pow((1 + parseFloat(dataPoints.discountRate)), i + 1)

      cashFlowBest += (cashFlowBest * (parseFloat(dataPoints.best.fcfOfRevenue) / 100))
      dcfBest += cashFlowBest / Math.pow((1 + parseFloat(dataPoints.discountRate)), i + 1)
    }
    setIntrinsicValue({
      marketCap: {
        worst: `$${Numeral(dcfWorst * parseFloat(dataPoints.worst.pfcfRatio)).format("0.00a")}`,
        normal: `$${Numeral(dcfNormal * parseFloat(dataPoints.normal.pfcfRatio)).format("0.00a")}`,
        best: `$${Numeral(dcfBest * parseFloat(dataPoints.best.pfcfRatio)).format("0.00a")}`,
      },
      stockValue: {
        worst: `$${(epsWorst * parseFloat(dataPoints.worst.peRatio)).toFixed(2)}`,
        normal: `$${(epsNormal * parseFloat(dataPoints.normal.peRatio)).toFixed(2)}`,
        best: `$${(epsBest * parseFloat(dataPoints.best.peRatio)).toFixed(2)}`,
      }
    })
  }

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
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, worst: { ...dataPoints.worst, revenueGrowth: event.target.value } })} value={dataPoints.worst.revenueGrowth} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, normal: { ...dataPoints.normal, revenueGrowth: event.target.value } })} value={dataPoints.normal.revenueGrowth} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, best: { ...dataPoints.best, revenueGrowth: event.target.value } })} value={dataPoints.best.revenueGrowth} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Share Change</p>
          <div className={classes.ValueRow}>
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, worst: { ...dataPoints.worst, shareChange: event.target.value } })} value={dataPoints.worst.shareChange} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, normal: { ...dataPoints.normal, shareChange: event.target.value } })} value={dataPoints.normal.shareChange} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, best: { ...dataPoints.best, shareChange: event.target.value } })} value={dataPoints.best.shareChange} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Profit Margin</p>
          <div className={classes.ValueRow}>
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, worst: { ...dataPoints.worst, profitMargin: event.target.value } })} value={dataPoints.worst.profitMargin} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, normal: { ...dataPoints.normal, profitMargin: event.target.value } })} value={dataPoints.normal.profitMargin} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, best: { ...dataPoints.best, profitMargin: event.target.value } })} value={dataPoints.best.profitMargin} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>FCF % of Revenue</p>
          <div className={classes.ValueRow}>
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, worst: { ...dataPoints.worst, fcfOfRevenue: event.target.value } })} value={dataPoints.worst.fcfOfRevenue} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, normal: { ...dataPoints.normal, fcfOfRevenue: event.target.value } })} value={dataPoints.normal.fcfOfRevenue} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, best: { ...dataPoints.best, fcfOfRevenue: event.target.value } })} value={dataPoints.best.fcfOfRevenue} label="" adornment="%" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Desired P/E</p>
          <div className={classes.ValueRow}>
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, worst: { ...dataPoints.worst, peRatio: event.target.value } })} value={dataPoints.worst.peRatio} label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, normal: { ...dataPoints.normal, peRatio: event.target.value } })} value={dataPoints.normal.peRatio} label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, best: { ...dataPoints.best, peRatio: event.target.value } })} value={dataPoints.best.peRatio} label="" adornment="" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem className={[classes.ScenarioRow].join(" ")}>
          <p className={classes.Title}>Desired P/FCF</p>
          <div className={classes.ValueRow}>
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, worst: { ...dataPoints.worst, pfcfRatio: event.target.value } })} value={dataPoints.worst.pfcfRatio} label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, normal: { ...dataPoints.normal, pfcfRatio: event.target.value } })} value={dataPoints.normal.pfcfRatio} label="" adornment="" variant="outlined" helperText="" margin="dense" />
            <InputField onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, best: { ...dataPoints.best, pfcfRatio: event.target.value } })} value={dataPoints.best.pfcfRatio} label="" adornment="" variant="outlined" helperText="" margin="dense" />
          </div>
        </ListItem>
        <Divider />
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Market Cap</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>{instrinsicValue.marketCap.worst}</p>
            <p className={classes.Value}>{instrinsicValue.marketCap.normal}</p>
            <p className={classes.Value}>{instrinsicValue.marketCap.best}</p>
          </div>
        </ListItem>
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Stock Price</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>{instrinsicValue.stockValue.worst}</p>
            <p className={classes.Value}>{instrinsicValue.stockValue.normal}</p>
            <p className={classes.Value}>{instrinsicValue.stockValue.best}</p>
          </div>
        </ListItem>
      </List>
      <>
        <InputField label="Outlook" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, outlook: event.target.value })} value={dataPoints.outlook} helperText="" select adornment="" variant="outlined" width="90px" margin="dense" />
        <InputField label="Discount Rate" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDataPoints({ ...dataPoints, discountRate: event.target.value })} value={dataPoints.discountRate} helperText="" adornment="%" variant="outlined" width="150px" margin="dense" />
        <Button onClick={analyzeHandler} className={styles.btn} variant="outlined">Analyze</Button>
      </>
    </form>
  );
}

interface InputFieldProps {
  label: string,
  variant: "standard" | "filled" | "outlined",
  margin: "dense" | "none" | "normal",
  helperText: string,
  adornment?: string,
  width?: string,
  error?: boolean,
  value?: number | string,
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> | undefined,
  select?: boolean
}

const InputField: React.FC<InputFieldProps> = ({ onChange, select, value, label, variant, margin, helperText, adornment, width, error }) => {
  const styles = useStyles()
  return (
    <TextField
      value={value}
      className={styles.root}
      style={{ width: width }}
      label={label}
      select={select}
      variant={variant}
      error={error}
      margin={margin}
      helperText={helperText}
      onChange={onChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>,
      }}
    >
      {select ?
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((year: string, key: number) => {
          return <MenuItem key={key} value={year}>{year}</MenuItem>
        })
        : null
      }
    </TextField>
  )
}

export default IntrinsicValueAnalyzer;