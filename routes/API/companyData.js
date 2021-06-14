const express = require("express");
const cheerio = require('cheerio');
const axios = require('axios');

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
    axios.get(`${config.SAL_SERVICE}/realTime/v3/${req.params.performanceid}/data?clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY,
            'x-api-realtime-e': config.X_API_REALTIME_E
        },
    }).then(response => {
        res.json(response.data)
    }).catch(err => {
        console.log(err)
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
        if (req.params.period === "1Y") {

        }
        res.json(data)
    }).catch(err => {
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

function inOrderTraversal(array, years, slice = 5) {
    let result = []
    if (years) {
        result.push({ title: "Breakdown", data: years?.slice(slice).reverse() || years.reverse() })
    }
    function helper(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]["subLevel"]) {
                helper(arr[i]["subLevel"])
            }
            if (arr[i]["datum"]) {
                result.push({
                    title: arr[i]["label"],
                    data: arr[i]["datum"]?.slice(slice).reverse() || arr[i]["datum"]?.reverse()
                })
            }
        }
    }
    helper(array)
    return result
}

// GET keyratios/valuations
router.get("/api/v1/company-data/key-ratios/valuation/:performanceid/details", (req, res) => {
    let data = []
    axios.get(`${config.SAL_SERVICE}/valuation/v3/${req.params.performanceid}?clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY,
            'X-API-REALTIME-E': config.X_API_REALTIME_E
        },
    }).then(response => {
        let dataCopy1 = [...response.data["Collapsed"].rows]
        let years = [...response.data["Collapsed"].columnDefs]
        let dataCopy2 = [...response.data["Expanded"].rows]
        let result1 = inOrderTraversal(dataCopy1, years, 0)
        let result2 = inOrderTraversal(dataCopy2, [], 0).slice(1)
        let newResult = result1.concat(result2)
        let endResult = newResult.map(el => {
            if (el.title !== "Breakdown") {
                return {
                    title: el.title,
                    data: el.data.map(item => {
                        return parseFloat(item).toFixed(2)
                    })
                }
            } else {
                return {
                    title: el.title,
                    data: el.data
                }
            }
        })
        res.json(endResult)
    }).catch(err => {
        console.log(err)
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// GET keyratios/operating Performance
router.get("/api/v1/company-data/key-ratios/operating-performance/:performanceid/details", (req, res) => {
    let data = []
    axios.get(`${config.SAL_SERVICE}/operatingPerformance/v2/${req.params.performanceid}?clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY,
            'X-API-REALTIME-E': config.X_API_REALTIME_E
        },
    }).then(response => {
        let dataCopy1 = [...response.data["reported"]["Collapsed"].rows]
        let years = [...response.data["reported"].columnDefs]
        let dataCopy2 = [...response.data["reported"]["Expanded"].rows]
        let result1 = inOrderTraversal(dataCopy1, years, 0)
        let result2 = inOrderTraversal(dataCopy2, [], 0).slice(1)
        let newResult = result1.concat(result2)
        let endResult = newResult.map(el => {
            if (el.title !== "Breakdown") {
                return {
                    title: el.title,
                    data: el.data.map(item => {
                        return parseFloat(item).toFixed(2)
                    })
                }
            } else {
                return {
                    title: el.title,
                    data: el.data
                }
            }
        })
        res.json(endResult)
    }).catch(err => {
        console.log(err)
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// -----------------------------------------------------------------

function traverseThroughHTML(htmlString, id) {
    let $ = cheerio.load(htmlString)
    let data = []
    $(id).children().each((i, el) => {
        return data.push($(el).text())
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
                { title: "Revenue", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Revenue", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header .rf_crow, #data_i1"), bold: true },
                { title: "Cost of Revenue", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header .rf_crow, #data_i6"), margin: true },
                { title: "Gross Profit", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header .rf_crow, #data_i10"), margin: true },

                { title: "Operating Expenses", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Operating Expenses", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > ..r_content > .rf_subtotal, #data_ttg3"), bold: true },
                { title: "Research & Development", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > ..r_content > .rf_crow, #data_i11"), margin: true },
                { title: "Sales, General & Administrative", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > ..r_content > .rf_crow, #data_i12"), margin: true },

                { title: "Operating Income", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i30") },
                { title: "Interest Expense", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i51") },
                { title: "Other Income (Expense)", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i52") },

                { title: "Net Income", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Net Income", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i80"), bold: true },
                { title: "Income Before Taxes", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i60"), margin: true },
                { title: "Provision for Income Taxes", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i61"), margin: true },
                { title: "Net Income from Continuing Operations", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i70"), margin: true },
                { title: "Net Income Available to Shareholders'", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i82"), margin: true },
                { title: "EBITDA", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i84") },

                { title: "Earnings Per Share", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Basic EPS", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i83") },
                { title: "Diluted EPS", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i84") },

                { title: "Average Shares Outstanding", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Basic WASO", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i85") },
                { title: "Diluted WASO", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i86") },
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
                { title: "Cash", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Cash", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_ttgg1"), bold: true },
                { title: "Cash & Cash Equivalent", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i1"), margin: true },
                { title: "Short-Term Investments", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i2"), margin: true },

                { title: "Current Assets", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Current Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg1"), bold: true },
                { title: "Total Cash", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_ttgg1"), margin: true },
                { title: "Account Receivables", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i3"), margin: true },
                { title: "Inventories", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i4"), margin: true },
                { title: "Other Current Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i8"), margin: true },

                { title: "Assets", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_total, #data_tts1"), bold: true },
                { title: "Total Current Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg1"), margin: true },
                { title: "Total Cash", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_ttgg1"), margin: true },
                { title: "Gross Property, Plant, & Equipment", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_crow, #data_i9"), margin: true },
                { title: "Accumulated Depreciation", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_crow, #data_i10"), margin: true },
                { title: "Net Property, Plant, & Equipment", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg2"), margin: true },
                { title: "Equity & Other Investments", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i11"), margin: true },
                { title: "GoodWill", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i12"), margin: true },
                { title: "Intangible Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i13"), margin: true },
                { title: "Other Long-Term Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i17"), margin: true },
                { title: "Total Non-Current Assets", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content > .r_content .rf_subtotal, #data_ttg2"), margin: true },

                { title: "Current Liabilities", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Current Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg5"), bold: true },
                { title: "Short-Term Debt", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i41"), margin: true },
                { title: "Accounts Payable", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i43"), margin: true },
                { title: "Accrued Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i46"), margin: true },
                { title: "Deferred Revenues", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i47"), margin: true },
                { title: "Other Current Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i49"), margin: true },

                { title: "Liabilities", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg5"), bold: true },
                { title: "Total Current Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg5"), margin: true },
                { title: "Long-Term Debt", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i50"), margin: true },
                { title: "Deferred Taxes Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i52"), margin: true },
                { title: "Deferred Revenues", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i54"), margin: true },
                { title: "Other Long-Term Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_crow, #data_i58"), margin: true },
                { title: "Total Non-Current Liabilities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content > .r_content .rf_subtotal, #data_ttgg6"), margin: true },

                { title: "Stockholders' Equity", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Total Stockholders' Equity", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_subtotal, #data_ttg8"), bold: true },
                { title: "Common Stock", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i82"), margin: true },
                { title: "Retained Earnings", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i85"), margin: true },
                { title: "Accumulated Other Comprehensive Income", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content > .r_content .rf_crow, #data_i89"), margin: true },
                { title: "Total Liabilities & Stockholders' Equity", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_total, #data_tts2") },

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
                { title: "Cash Flows - Operations", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Cash Flows From Operations", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_total, #data_tts1"), bold: true },
                { title: "Net Income", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i1"), margin: true },
                { title: "Depreciation & Amortization", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i2"), margin: true },
                { title: "Deferred Income Taxes", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i6"), margin: true },
                { title: "Stock Based Compensation", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i10"), margin: true },
                { title: "Change in Working Capital", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i15"), margin: true },
                { title: "Accounts Receivable", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i16"), margin: true },
                { title: "Inventory", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i17"), margin: true },
                { title: "Accounts Payable", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i19"), margin: true },
                { title: "Other Working Capital", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i23"), margin: true },
                { title: "Other Non-Cash Items", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i30"), margin: true },

                { title: "Cash Flows - Investing", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Cash Flows From Investing", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_total, #data_tts2"), bold: true },
                { title: "Investments in Property, Plant & Equipment", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i31"), margin: true },
                { title: "Acquisitions, Net", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i33"), margin: true },
                { title: "Purchases of Investments", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i34"), margin: true },
                { title: "Sales/Maturities of Investments", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i35"), margin: true },
                { title: "Purchases of Intangibles", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i38"), margin: true },
                { title: "Other Investing Activities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i60"), margin: true },

                { title: "Cash Flows - Financing", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Cash Flows from Financing", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_tts3"), bold: true },
                { title: "Debt Issued", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i61"), margin: true },
                { title: "Debt Repayment", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i62"), margin: true },
                { title: "Common Stock Issued", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i66"), margin: true },
                { title: "Common Stock Repurchased", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i67"), margin: true },
                { title: "Dividend Paid", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i69"), margin: true },
                { title: "Other Financing Activities", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i90"), margin: true },

                { title: "Cash Position", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Ending Cash Position", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i95"), bold: true },
                { title: "Beginning Cash Position", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i94"), margin: true },
                { title: "Net Change in Cash", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .rf_crow, #data_i93"), margin: true },

                { title: "Free Cash Flow", data: traverseThroughHTML(htmlString, ".main .r_xcmenu.rf_table .rf_header"), highlight: true },
                { title: "Free Cash Flow", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i97"), bold: true },
                { title: "Operating Cash Flows", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i100"), margin: true },
                { title: "Capital Expenditures", data: traverseThroughHTML(htmlString, ".main > .r_xcmenu.rf_table .rf_header > .r_content .rf_crow, #data_i96"), margin: true }
            ]
            res.json(data)
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})

// -----------------------------------------------------------------

module.exports = router;