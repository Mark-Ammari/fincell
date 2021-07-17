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
  const stockValue = useSelector(fairValueData)[0][1]["rawValue"]
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
      worst: "$0.00",
      normal: "$0.00",
      best: "$0.00"
    },
    earningsValue: {
      worst: "$0.00",
      normal: "$0.00",
      best: "$0.00"
    },
    dcfValue: {
      worst: "$0.00",
      normal: "$0.00",
      best: "$0.00"
    },
    marginOfSafety: {
      worst: "%0.00 %0.00",
      normal: "%0.00 %0.00",
      best: "%0.00 %0.00"
    }
  })

  const analyzeHandler = () => {
    let mktCapWorst = []
    let mktCapNormal = []
    let mktCapBest = []

    let epsWorst = []
    let epsNormal = []
    let epsBest = []

    let dcfWorst = []
    let dcfNormal = []
    let dcfBest = []

    let revGrowthWorst = parseInt(epsVal[0]["rawValue"])
    let revGrowthNormal = parseInt(epsVal[0]["rawValue"])
    let revGrowthBest = parseInt(epsVal[0]["rawValue"])

    let cashFlowWorst = []
    let cashFlowNormal = []
    let cashFlowBest = []

    let netProfitWorst = []
    let netProfitNormal = []
    let netProfitBest = []

    let wasoWorst = parseInt(epsVal[3]["rawValue"])
    let wasoNormal = parseInt(epsVal[3]["rawValue"])
    let wasoBest = parseInt(epsVal[3]["rawValue"])

    for (let i = 1; i < parseInt(dataPoints.outlook) + 1; i++) {
      revGrowthWorst += (revGrowthWorst * (parseFloat(dataPoints.worst.revenueGrowth) / 100))
      wasoWorst += (wasoWorst * (parseFloat(dataPoints.worst.shareChange) / 100))
      cashFlowWorst.push(revGrowthWorst * (parseFloat(dataPoints.worst.fcfOfRevenue) / 100))
      mktCapWorst.push((cashFlowWorst[i - 1] * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      dcfWorst.push(((cashFlowWorst[i - 1] / wasoWorst) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      netProfitWorst.push(revGrowthWorst * (parseFloat(dataPoints.worst.profitMargin) / 100))
      epsWorst.push(((netProfitWorst[i - 1] / wasoWorst) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      // ==========================================================================================================================
      revGrowthNormal += (revGrowthNormal * (parseFloat(dataPoints.normal.revenueGrowth) / 100))
      wasoNormal += (wasoNormal * (parseFloat(dataPoints.normal.shareChange) / 100))
      cashFlowNormal.push(revGrowthNormal * (parseFloat(dataPoints.normal.fcfOfRevenue) / 100))
      mktCapNormal.push((cashFlowNormal[i - 1] * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      dcfNormal.push(((cashFlowNormal[i - 1] / wasoNormal) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      netProfitNormal.push(revGrowthNormal * (parseFloat(dataPoints.normal.profitMargin) / 100))
      epsNormal.push(((netProfitNormal[i - 1] / wasoNormal) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      // ==========================================================================================================================
      revGrowthBest += (revGrowthBest * (parseFloat(dataPoints.best.revenueGrowth) / 100))
      wasoBest += (wasoBest * (parseFloat(dataPoints.best.shareChange) / 100))
      cashFlowBest.push(revGrowthBest * (parseFloat(dataPoints.best.fcfOfRevenue) / 100))
      mktCapBest.push((cashFlowBest[i - 1] * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      dcfBest.push(((cashFlowBest[i - 1] / wasoBest) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
      netProfitBest.push(revGrowthBest * (parseFloat(dataPoints.best.profitMargin) / 100))
      epsBest.push(((netProfitBest[i - 1] / wasoBest) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -i)))
    }

    mktCapWorst.push((cashFlowWorst[cashFlowWorst.length - 1] * parseFloat(dataPoints.worst.pfcfRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    mktCapNormal.push((cashFlowNormal[cashFlowNormal.length - 1] * parseFloat(dataPoints.normal.pfcfRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    mktCapBest.push((cashFlowBest[cashFlowBest.length - 1] * parseFloat(dataPoints.best.pfcfRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    // ==========================================================================================================================
    dcfWorst.push(((cashFlowWorst[cashFlowWorst.length - 1] / wasoWorst) * parseFloat(dataPoints.worst.pfcfRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    dcfNormal.push(((cashFlowNormal[cashFlowNormal.length - 1] / wasoWorst) * parseFloat(dataPoints.normal.pfcfRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    dcfBest.push(((cashFlowBest[cashFlowBest.length - 1] / wasoWorst) * parseFloat(dataPoints.best.pfcfRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    // ==========================================================================================================================
    epsWorst.push(((netProfitWorst[netProfitWorst.length - 1] / wasoWorst) * parseFloat(dataPoints.worst.peRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    epsNormal.push(((netProfitNormal[netProfitNormal.length - 1] / wasoNormal) * parseFloat(dataPoints.normal.peRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))
    epsBest.push(((netProfitBest[netProfitBest.length - 1] / wasoBest) * parseFloat(dataPoints.best.peRatio)) * Math.pow((1 + (parseFloat(dataPoints.discountRate) / 100)), -parseFloat(dataPoints.outlook)))

    setIntrinsicValue({
      marketCap: {
        worst: `${Numeral(mktCapWorst.reduce((a, b) => a + b)).format("$0.00a")}`,
        normal: `${Numeral(mktCapNormal.reduce((a, b) => a + b)).format("$0.00a")}`,
        best: `${Numeral(mktCapBest.reduce((a, b) => a + b)).format("$0.00a")}`
      },
      earningsValue: {
        worst: `${Numeral(epsWorst.reduce((a, b) => a + b)).format("$0.00a")}`,
        normal: `${Numeral(epsNormal.reduce((a, b) => a + b)).format("$0.00a")}`,
        best: `${Numeral(epsBest.reduce((a, b) => a + b)).format("$0.00a")}`
      },
      dcfValue: {
        worst: `${Numeral(dcfWorst.reduce((a, b) => a + b)).format("$0.00a")}`,
        normal: `${Numeral(dcfNormal.reduce((a, b) => a + b)).format("$0.00a")}`,
        best: `${Numeral(dcfBest.reduce((a, b) => a + b)).format("$0.00a")}`
      },
      marginOfSafety: {
        worst: `${Numeral(((epsWorst.reduce((a, b) => a + b) - stockValue) / stockValue)).format("0.00%")} ${Numeral(((dcfWorst.reduce((a, b) => a + b) - stockValue) / stockValue)).format("0.00%")}`,
        normal: `${Numeral(((epsNormal.reduce((a, b) => a + b) - stockValue) / stockValue)).format("0.00%")} ${Numeral(((dcfNormal.reduce((a, b) => a + b) - stockValue) / stockValue)).format("0.00%")}`,
        best: `${Numeral(((epsBest.reduce((a, b) => a + b) - stockValue) / stockValue)).format("0.00%")} ${Numeral(((dcfBest.reduce((a, b) => a + b) - stockValue) / stockValue)).format("0.00%")}`
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
        <Divider />
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Earnings Value</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>{instrinsicValue.earningsValue.worst}</p>
            <p className={classes.Value}>{instrinsicValue.earningsValue.normal}</p>
            <p className={classes.Value}>{instrinsicValue.earningsValue.best}</p>
          </div>
        </ListItem>
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>DCF Value</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>{instrinsicValue.dcfValue.worst}</p>
            <p className={classes.Value}>{instrinsicValue.dcfValue.normal}</p>
            <p className={classes.Value}>{instrinsicValue.dcfValue.best}</p>
          </div>
        </ListItem>
        <Divider />
        <ListItem button className={classes.ScenarioRow}>
          <p className={classes.Title}>Margin of Safety</p>
          <div className={classes.ValueRow}>
            <p className={classes.Value}>{instrinsicValue.marginOfSafety.worst}</p>
            <p className={classes.Value}>{instrinsicValue.marginOfSafety.normal}</p>
            <p className={classes.Value}>{instrinsicValue.marginOfSafety.best}</p>
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