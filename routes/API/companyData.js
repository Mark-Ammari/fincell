const express = require("express");
const cheerio = require('cheerio');
const axios = require('axios');
const Numeral = require('numeral');

const config = require("../../config/keys");

const router = express.Router();


// GET Search Ticker
router.get("/api/v1/company-data/search/:ticker", (req, res) => {
    axios.get(`${config.URI}/search/entities?q=${req.params.ticker}&limit=6&autocomplete=true`, {
        headers: {
            'x-api-key': config.SEARCH_API_KEY
        }
    }).then(response => {
        res.json(response.data)
    }).catch(err => {
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// GET quotes
router.get("/api/v1/company-data/quote/:performanceid/details", (req, res) => {
    let data = []
    let URIone = axios.get(`${config.SAL_SERVICE}/keyratios/${req.params.performanceid}/data?clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY,
            'x-api-realtime-e': config.X_API_REALTIME_E
        }
    }).then(response => { return response.data })
    let URItwo = axios.get(`${config.SAL_SERVICE}/realTime/v3/${req.params.performanceid}/data?clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY,
            'x-api-realtime-e': config.X_API_REALTIME_E
        }
    }).then(response => { return response.data })
    Promise.all([URIone, URItwo]).then(response => {
        data = {
            quote: [
                { title: "Today's Stats", data: response[1]["recentTradingDay"], highlight: true },
                { title: "Market Cap", data: Numeral(response[1]["marketCap"]).format("0.00a"), bold: true },
                { title: "Volume", data: Numeral(response[1]["volume"]).format("0.00a") },
                { title: "Today's High", data: response[1]["dayRangeHigh"] },
                { title: "Today's Low", data: response[1]["dayRangeLow"] },
                { title: "52-Week High", data: response[1]["yearRangeHigh"] },
                { title: "52-Week Low", data: response[1]["yearRangeLow"] },
                { title: "Dividend Yield", data: response[1]["dividendYield"], bold: true }
            ],
            growthRatio: [
                { title: "Growth Ratio", data: response[0]["growthRatio"]["reportDate"], highlight: true },
                { title: "Revenue", data: Numeral(response[0]["growthRatio"]["revenue"]).format('0.00%') },
                { title: "Profit Margin", data: Numeral(response[0]["profitabilityRatio"]["netMargin"]).format('0.00%'), bold: true },
                { title: "Operating Income", data: Numeral(response[0]["growthRatio"]["operatingIncome"]).format('0.00%') },
                { title: "Net Income", data: Numeral(response[0]["growthRatio"]["netIncome"]).format('0.00%') },
                { title: "Earnings Per Share", data: Numeral(response[0]["growthRatio"]["eps"]).format('0.00%') }
            ],

            valuationRatio: [
                { title: "Valuation Ratio", data: response[0]["valuationRatio"]["asOfDate"], highlight: true },
                { title: "P/E Ratio (TTM)", data: response[0]["valuationRatio"]["priceToEPS"], bold: true },
                { title: "P/B Ratio (TTM)", data: response[0]["valuationRatio"]["priceToBook"] },
                { title: "P/S Ratio (TTM)", data: response[0]["valuationRatio"]["priceToSales"] },
                { title: "P/CF Ratio (TTM)", data: response[0]["valuationRatio"]["priceToCashFlow"], bold: true },
            ],

            efficiencyRatio: [
                { title: "Efficiency Ratio", data: response[0]["efficiencyRatio"]["reportDate"], highlight: true },
                { title: "Return on Assets", data: Numeral(response[0]["efficiencyRatio"]["returnOnAssets"]).format('0.00%'), bold: true },
                { title: "Return on Equity", data: Numeral(response[0]["efficiencyRatio"]["returnOnEquity"]).format('0.00%') },
                { title: "Return on Invested Capital", data: Numeral(response[0]["efficiencyRatio"]["returnOnInvestedCapital"]).format('0.00%'), bold: true },
            ],

            financialHealth: [
                { title: "Financial Health", data: response[0]["financialHealth"]["reportDate"], highlight: true },
                { title: "Asset/Debt", data: Numeral(response[0]["financialHealth"]["currentRatio"]).format('0.00%'), bold: true },
                { title: "Quick Ratio", data: Numeral(response[0]["financialHealth"]["quickRatio"]).format('0.00%') },
                { title: "Debt/Equity", data: Numeral(response[0]["financialHealth"]["debtToEquity"]).format('0.00%') },
            ]
        }
        res.json(data)
    }).catch(err => {
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// GET Chart Data (SEEKING ALPHA)
router.get("/api/v1/company-data/chart/:ticker/:period/details", (req, res) => {
    let data = {}

    axios.get(`${config.SEEKING_ALPHA_URI}/chart?period=${req.params.period}&symbol=${req.params.ticker}`
    ).then(response => {
        data = Object.keys(response.data.attributes).map((el) => {
            return {
                date: el.substring(0, 10),
                close: response.data.attributes[el].close
            }
        }).sort((a, b) => {
            let dateA = new Date(a.date)
            let dateB = new Date(b.date)
            return dateA - dateB;
        })
        res.json(data)
    }).catch(err => {
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// -----------------------------------------------------------------

function traverseThroughFinancialsHTML(htmlString, id) {
    let $ = cheerio.load(htmlString)
    let data = []
    $(id).children().each((i, el) => {
        return data.push($(el).attr("rawvalue") || $(el).text())
    })
    return data
}

// GET INCOMESTATEMENT
router.get("/api/v1/company-data/report-type/income-statement/:ticker/details", (req, res) => {
    let data = []
    axios.get(`${config.financialsURI}?&t=${req.params.ticker}&reportType=is&period=12&dataType=A&order=desc&rounding=3`)
        .then(response => {
            let htmlString = response.data["result"]
            data = [
                { title: "Revenue", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Revenue", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header .rf_crow, #data_i1"), bold: true },
                { title: "Cost of Revenue", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header .rf_crow, #data_i6"), margin: true },
                { title: "Gross Profit", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header .rf_crow, #data_i10"), margin: true },

                { title: "Operating Expenses", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Operating Expenses", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > ..r_content > .rf_subtotal, #data_ttg3"), bold: true },
                { title: "Research & Development", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > ..r_content > .rf_crow, #data_i11"), margin: true },
                { title: "Sales, General & Administrative", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > ..r_content > .rf_crow, #data_i12"), margin: true },

                { title: "Operating Income", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i30") },
                { title: "Interest Expense", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i51") },
                { title: "Other Income (Expense)", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i52") },

                { title: "Net Income", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Net Income", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i80"), bold: true },
                { title: "Income Before Taxes", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i60"), margin: true },
                { title: "Provision for Income Taxes", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i61"), margin: true },
                { title: "Net Income from Continuing Operations", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i70"), margin: true },
                { title: "Net Income Available to Shareholders'", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i82"), margin: true },
                { title: "EBITDA", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i84") },

                { title: "Earnings Per Share", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Basic EPS", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i83") },
                { title: "Diluted EPS", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i84") },

                { title: "Average Shares Outstanding", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Basic WASO", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i85") },
                { title: "Diluted WASO", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i86") },
            ]
            // res.send($(".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i90").html())
            res.json(data)
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})

// GET BALANCESHEET
router.get("/api/v1/company-data/report-type/balance-sheet/:ticker/details", (req, res) => {
    let data = []
    axios.get(`${config.financialsURI}?&t=${req.params.ticker}&reportType=bs&period=12&dataType=A&order=desc&rounding=3`)
        .then(response => {
            let htmlString = response.data["result"]
            data = [
                { title: "Cash", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Cash", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_ttgg1"), bold: true },
                { title: "Cash & Cash Equivalent", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i1"), margin: true },
                { title: "Short-Term Investments", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i2"), margin: true },

                { title: "Current Assets", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Current Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg1"), bold: true },
                { title: "Total Cash", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_ttgg1"), margin: true },
                { title: "Account Receivables", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i3"), margin: true },
                { title: "Inventories", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i4"), margin: true },
                { title: "Other Current Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i8"), margin: true },

                { title: "Assets", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_total, #data_tts1"), bold: true },
                { title: "Total Current Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg1"), margin: true },
                { title: "Total Cash", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_ttgg1"), margin: true },
                { title: "Gross Property, Plant, & Equipment", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_crow, #data_i9"), margin: true },
                { title: "Accumulated Depreciation", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_crow, #data_i10"), margin: true },
                { title: "Net Property, Plant, & Equipment", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg2"), margin: true },
                { title: "Equity & Other Investments", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i11"), margin: true },
                { title: "GoodWill", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i12"), margin: true },
                { title: "Intangible Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i13"), margin: true },
                { title: "Other Long-Term Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i17"), margin: true },
                { title: "Total Non-Current Assets", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_subtotal, #data_ttg2"), margin: true },

                { title: "Current Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Current Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg5"), bold: true },
                { title: "Short-Term Debt", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i41"), margin: true },
                { title: "Accounts Payable", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i43"), margin: true },
                { title: "Accrued Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i46"), margin: true },
                { title: "Deferred Revenues", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i47"), margin: true },
                { title: "Other Current Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i49"), margin: true },

                { title: "Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg5"), bold: true },
                { title: "Total Current Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg5"), margin: true },
                { title: "Long-Term Debt", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i50"), margin: true },
                { title: "Deferred Taxes Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i52"), margin: true },
                { title: "Deferred Revenues", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i54"), margin: true },
                { title: "Other Long-Term Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i58"), margin: true },
                { title: "Total Non-Current Liabilities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg6"), margin: true },

                { title: "Stockholders' Equity", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Stockholders' Equity", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg8"), bold: true },
                { title: "Common Stock", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i82"), margin: true },
                { title: "Retained Earnings", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i85"), margin: true },
                { title: "Accumulated Other Comprehensive Income", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i89"), margin: true },
                { title: "Total Liabilities & Stockholders' Equity", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_total, #data_tts2") },

            ]
            res.json(data)
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})

// GET CASHFLOW
router.get("/api/v1/company-data/report-type/cash-flow/:ticker/details", (req, res) => {
    let data = []
    axios.get(`${config.financialsURI}?&t=${req.params.ticker}&reportType=cf&period=12&dataType=A&order=desc&rounding=3`)
        .then(response => {
            let htmlString = response.data["result"]
            data = [
                { title: "Cash Flows - Operations", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Cash Flows From Operations", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_total, #data_tts1"), bold: true },
                { title: "Net Income", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i1"), margin: true },
                { title: "Depreciation & Amortization", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i2"), margin: true },
                { title: "Deferred Income Taxes", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i6"), margin: true },
                { title: "Stock Based Compensation", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i10"), margin: true },
                { title: "Change in Working Capital", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i15"), margin: true },
                { title: "Accounts Receivable", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i16"), margin: true },
                { title: "Inventory", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i17"), margin: true },
                { title: "Accounts Payable", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i19"), margin: true },
                { title: "Other Working Capital", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i23"), margin: true },
                { title: "Other Non-Cash Items", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i30"), margin: true },

                { title: "Cash Flows - Investing", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Cash Flows From Investing", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_total, #data_tts2"), bold: true },
                { title: "Investments in Property, Plant & Equipment", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i31"), margin: true },
                { title: "Acquisitions, Net", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i33"), margin: true },
                { title: "Purchases of Investments", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i34"), margin: true },
                { title: "Sales/Maturities of Investments", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i35"), margin: true },
                { title: "Purchases of Intangibles", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i38"), margin: true },
                { title: "Other Investing Activities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i60"), margin: true },

                { title: "Cash Flows - Financing", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Cash Flows from Financing", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_tts3"), bold: true },
                { title: "Debt Issued", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i61"), margin: true },
                { title: "Debt Repayment", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i62"), margin: true },
                { title: "Common Stock Issued", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i66"), margin: true },
                { title: "Common Stock Repurchased", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i67"), margin: true },
                { title: "Dividend Paid", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i69"), margin: true },
                { title: "Other Financing Activities", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i90"), margin: true },

                { title: "Cash Position", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Ending Cash Position", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i95"), bold: true },
                { title: "Beginning Cash Position", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i94"), margin: true },
                { title: "Net Change in Cash", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i93"), margin: true },

                { title: "Free Cash Flow", data: traverseThroughFinancialsHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Free Cash Flow", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i97"), bold: true },
                { title: "Operating Cash Flows", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i100"), margin: true },
                { title: "Capital Expenditures", data: traverseThroughFinancialsHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i96"), margin: true }
            ]
            res.json(data)
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})

// -----------------------------------------------------------------

function traverseThroughKeyStatsHTML(htmlString, id) {
    let $ = cheerio.load(htmlString)
    let data = []
    $(id).each((i, el) => {
        if ($(el).text()) {
            return data.push($(el).text())
        }
    })
    return data
}

// GET financialsPart
router.get("/api/v1/company-data/key-ratios/financials/:ticker/details", (req, res) => {
    let data = []
    axios.get(`${config.financialsPartURI}?&t=${req.params.ticker}&region=usa&culture=en-US&cur=&order=desc`)
        .then(response => {
            let htmlString = response.data["componentData"]
            let heading = traverseThroughKeyStatsHTML(htmlString, "th").slice(0, 11)
            let financialData = traverseThroughKeyStatsHTML(htmlString, "td")
            data = [
                { title: "Breakdown", data: heading, highlight: true },
                { title: "Revenue USD Mil", data: financialData.slice(0, 11), bold: true },
                { title: "Gross Margin %", data: financialData.slice(11, 22), bold: true },
                { title: "Operating Income USD Mil", data: financialData.slice(22, 33) },
                { title: "Operating Margin %", data: financialData.slice(33, 44) },
                { title: "Net Income USD Mil", data: financialData.slice(44, 55) },
                { title: "Earnings Per Share USD", data: financialData.slice(55, 66) },
                { title: "Dividends USD", data: financialData.slice(66, 77) },
                { title: "Payout Ratio %", data: financialData.slice(77, 88) },
                { title: "Shares Mil", data: financialData.slice(88, 99) },
                { title: "Book Value Per Share USD", data: financialData.slice(99, 110) },
                { title: "Operating Cash Flow USD Mil", data: financialData.slice(110, 121) },
                { title: "Cap Spending USD Mil", data: financialData.slice(121, 132) },
                { title: "Free Cash Flow USD Mil", data: financialData.slice(132, 143), bold: true },
                { title: "Free Cash Flow Per Share USD", data: financialData.slice(143, 154) },
                { title: "Working Capital USD Mil", data: financialData.slice(154, 165) },
            ]
            res.json(data)
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})

// GET keyStatsPart
router.get("/api/v1/company-data/key-ratios/stats/:ticker/details", (req, res) => {
    let data = []
    axios.get(`${config.keyStatsPartURI}?&t=${req.params.ticker}&region=usa&culture=en-US&cur=&order=desc`)
        .then(response => {
            let htmlString = response.data["componentData"]
            let financialData = traverseThroughKeyStatsHTML(htmlString, "td")
            let heading = traverseThroughKeyStatsHTML(htmlString, "th").slice(1, 12)
            data = {
                profitability: [
                    { title: "Margin % of Sales", data: heading, highlight: true },
                    { title: "Revenue", data: financialData.slice(0, 11), bold: true },
                    { title: "COGS", data: financialData.slice(11, 22) },
                    { title: "Gross Margin", data: financialData.slice(22, 33), bold: true },
                    { title: "SG&A", data: financialData.slice(33, 44) },
                    { title: "R&D", data: financialData.slice(44, 55) },
                    { title: "Other", data: financialData.slice(55, 66) },
                    { title: "Operating Margin", data: financialData.slice(66, 77), bold: true },
                    { title: "Net Int Inc & Other", data: financialData.slice(77, 88) },
                    { title: "EBT Margin", data: financialData.slice(88, 99) },
                    { title: "Profitability", data: heading, highlight: true },
                    { title: "Tax Rate %", data: financialData.slice(99, 110) },
                    { title: "Net Margin %", data: financialData.slice(110, 121), bold: true },
                    { title: "Asset Turnover (AVG)", data: financialData.slice(121, 132) },
                    { title: "Return on Assets %", data: financialData.slice(132, 143), bold: true },
                    { title: "Financial Leverage (AVG)", data: financialData.slice(143, 154) },
                    { title: "Return on Equity %", data: financialData.slice(154, 165), bold: true },
                    { title: "Return on Invested Capital %", data: financialData.slice(165, 176), bold: true },
                    { title: "Interest Coverage", data: financialData.slice(176, 187) },
                ],
                growth: [
                    { title: "Revenue %", data: heading, highlight: true },
                    { title: "YoY", data: financialData.slice(187, 198) },
                    { title: "3Y AVG", data: financialData.slice(198, 209) },
                    { title: "5Y AVG", data: financialData.slice(209, 220) },
                    { title: "10Y AVG", data: financialData.slice(220, 231) },

                    { title: "Operating Income %", data: heading, highlight: true },
                    { title: "YoY", data: financialData.slice(231, 242) },
                    { title: "3Y AVG", data: financialData.slice(242, 253) },
                    { title: "5Y AVG", data: financialData.slice(253, 264) },
                    { title: "10Y AVG", data: financialData.slice(264, 275) },

                    { title: "Net Income %", data: heading, highlight: true },
                    { title: "YoY", data: financialData.slice(275, 286) },
                    { title: "3Y AVG", data: financialData.slice(286, 297) },
                    { title: "5Y AVG", data: financialData.slice(297, 308) },
                    { title: "10Y AVG", data: financialData.slice(308, 319) },

                    { title: "EPS %", data: heading, highlight: true },
                    { title: "YoY", data: financialData.slice(319, 330) },
                    { title: "3Y AVG", data: financialData.slice(330, 341) },
                    { title: "5Y AVG", data: financialData.slice(341, 352) },
                    { title: "10Y AVG", data: financialData.slice(352, 363) },
                ],

                cashFlow: [
                    { title: "Cash Flow Ratios", data: heading, highlight: true },
                    { title: "Operating Cash Flow Growth % YoY", data: financialData.slice(363, 374), bold: true },
                    { title: "Free Cash Flow Growth % YoY", data: financialData.slice(374, 385), bold: true },
                    { title: "Cap Ex as a % of Sales", data: financialData.slice(385, 396) },
                    { title: "Free Cash Flow/Sales %", data: financialData.slice(396, 407) },
                    { title: "Free Cash Flow/Net Income", data: financialData.slice(407, 418) },
                ],

                financialHealth: [
                    { title: "Balance Sheet Items (in %)", data: heading, highlight: true },
                    { title: "Cash & Short-Term Investments", data: financialData.slice(418, 429) },
                    { title: "Accounts Receivable", data: financialData.slice(429, 440) },
                    { title: "Inventory", data: financialData.slice(440, 451) },
                    { title: "Other Current Assets", data: financialData.slice(451, 462) },
                    { title: "Total Current Assets", data: financialData.slice(462, 473), bold: true },
                    { title: "Net PP&E", data: financialData.slice(473, 484) },
                    { title: "Intangibles", data: financialData.slice(484, 495) },
                    { title: "Other Long-Term Assets", data: financialData.slice(495, 506) },
                    { title: "Total Assets", data: financialData.slice(506, 517), bold: true },

                    { title: "Accounts Payable", data: financialData.slice(517, 528) },
                    { title: "Short-Term Debt", data: financialData.slice(528, 539) },
                    { title: "Taxes Payable", data: financialData.slice(539, 550) },
                    { title: "Accrued Liabilities", data: financialData.slice(550, 561) },
                    { title: "Other Short-Term Debt", data: financialData.slice(561, 572) },
                    { title: "Total Current Liabilities", data: financialData.slice(572, 583), bold: true },
                    { title: "Long-Term Debt", data: financialData.slice(583, 594) },
                    { title: "Other Long-Term Liabilities", data: financialData.slice(594, 605) },
                    { title: "Total Liabilities", data: financialData.slice(605, 616), bold: true },
                    { title: "Total Stockholders' Equity", data: financialData.slice(616, 627) },
                    { title: "Total Liabilities & Equity", data: financialData.slice(627, 638) },

                    { title: "Liquidity/Financial Health", data: heading, highlight: true },
                    { title: "Asset/Debt", data: financialData.slice(638, 649), bold: true },
                    { title: "Quick Ratio", data: financialData.slice(649, 660) },
                    { title: "Financial Leverage", data: financialData.slice(660, 671) },
                    { title: "Debt/Equity", data: financialData.slice(671, 682) },
                ]
            }
            res.json(data)
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})

module.exports = router;