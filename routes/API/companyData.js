const express = require("express");
const cheerio = require('cheerio');
const axios = require('axios');

const config = require("../../config/keys");

const router = express.Router();

let toArray = function (htmlString, htmlPath) {
    const $ = cheerio.load(htmlString);
    let array = []
    $(htmlPath).children().each((i, elem) => {
        array[i] = $(elem).text().trim()
    })
    return array
}

router.get("/api/v1/company-data/income-statement/:ticker", (req, res) => {
    let data = []
    axios.get(config.financialsURI + `&t=${req.params.ticker}`)
        .then(response => {
            let htmlString = response.data.result;
            data = [
                {
                    title: "Breakdown",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .rf_header, #Year')
                },
                {
                    title: "Revenue",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i1')
                },
                {
                    title: "Cost of Revenue",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i6')
                },
                {
                    title: "Gross Profit",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i10')
                },
                {
                    title: "Operating Expenses",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_g3')
                },
                {
                    title: "Research and Development",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i11')
                },
                {
                    title: "Sales, General, and Administrative",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i12')
                },
                {
                    title: "Restructuring, Mergers, and Acquisitions",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i25')
                },
                {
                    title: "Other Operating Expenses",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i29')
                },
                {
                    title: "Total Operating Expenses",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_ttg3')
                },
                {
                    title: "Operating Income",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i30')
                },
                {
                    title: "Interest Expense",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i51')
                },
                {
                    title: "Other Income (expense)",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i52')
                },
                {
                    title: "Income Before Taxes",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i60')
                },
                {
                    title: "Provision for Income Taxes",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i61')
                },
                {
                    title: "Net Income from Continuing Operations",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i70')
                },
                {
                    title: "Net Income",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i80')
                },
                {
                    title: "Net Income Available to Shareholders'",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i82')
                },
                {
                    title: "Basic EPS",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i83')
                },
                {
                    title: "Diluted EPS",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i84')
                },
                {
                    title: "Average Basic Shares Outstanding",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i85')
                },
                {
                    title: "Average Diluted Shares Outstanding",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i86')
                },
                {
                    title: "EBITDA",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i90')
                },
            ]
            res.send(data)
        }).catch(err => {
            res.status(400).send({error: true, message: "Something weng wrong. The ticker entered may not exist"})
        })
})

router.get("/api/v1/company-data/balance-sheet-statement/:ticker", (req, res) => {
    let data = []
    axios.get(config.financialsURI + `&t=${req.params.ticker}&reportType=bs`)
        .then(response => {
            let htmlString = response.data.result;
            data = [
                {
                    title: "Breakdown",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .rf_header, #Year')
                },
                {
                    title: "Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_s1')
                },
                {
                    title: "Current Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_g1')
                },
                {
                    title: "Cash",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_gg1')
                },
                {
                    title: "Cash and Cash Equivalents",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_i1')
                },
                {
                    title: "Short-Term Investments",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_i2')
                },
                {
                    title: "Total Cash",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_ttgg1')
                },
                {
                    title: "Account Receivables",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_i3')
                },
                {
                    title: "Inventory",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_i4')
                },
                {
                    title: "Other Current Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_i8')
                },
                {
                    title: "Total Current Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_ttg1')
                },
                {
                    title: "Non-Current Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_g2')
                },
                {
                    title: "Property, Plant, and Equipment",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_gg2')
                },
                {
                    title: "Gross Property, Plant, and Equipment",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content > r_content, #data_i9')
                },
                {
                    title: "Accumulated Depreciation",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content > r_content, #data_i10')
                },
                {
                    title: "Net Property, Plant, and Equipment",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content > r_content, #data_ttgg2')
                },
                {
                    title: "Equity and Other Investments",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_i11')
                },
                {
                    title: "Goodwill",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_i12')
                },
                {
                    title: "Intangible Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_i13')
                },
                {
                    title: "Other Long-Term Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_i17')
                },
                {
                    title: "Total Non-Current Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content > r_content, #data_ttg2')
                },
                {
                    title: "Total Assets",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .r_content > r_content, #data_tts1')
                },
                {
                    title: "Liabilities and Stockholders' Equity",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_s2')
                },
                {
                    title: "Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_g5')
                },
                {
                    title: "Current Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_gg5')
                },
                {
                    title: "Short-Term Debt",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i41')
                },
                {
                    title: "Accounts Payable",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i43')
                },
                {
                    title: "Taxes Payable",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i45')
                },
                {
                    title: "Deferred Revenues",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i47')
                },
                {
                    title: "Other Current Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i49')
                },
                {
                    title: "Total Current Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_ttgg5')
                },
                {
                    title: "Non-Current Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_gg6')
                },
                {
                    title: "Long-Term Debt",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i50')
                },
                {
                    title: "Capital leases",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i51')
                },
                {
                    title: "Deferred Taxes Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i52')
                },
                {
                    title: "Deferred Revenues",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i54')
                },
                {
                    title: "Other Long-Term Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_i58')
                },
                {
                    title: "Total Non-Current Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content > r_content, #data_ttgg6')
                },
                {
                    title: "Total Liabilities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_ttg5')
                },
                {
                    title: "Shareholders' Equity",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_g8')
                },
                {
                    title: "Common Stock",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_i82')
                },
                {
                    title: "Retained Earnings",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_i85')
                },
                {
                    title: "Accumulated Other Comprehensive Income",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_i89')
                },
                {
                    title: "Total Shareholders' Equity",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content > r_content, #data_ttg8')
                },
                {
                    title: "Total Shareholders' Equity",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_tts2')
                },
            ]
            res.send(data)
        }).catch(err => {
            res.status(400).send({error: true, message: "Something weng wrong. The ticker entered may not exist"})
        })
})

router.get("/api/v1/company-data/cash-flow-statement/:ticker", (req, res) => {
    let data = []
    axios.get(config.financialsURI + `&t=${req.params.ticker}&reportType=cf`)
        .then(response => {
            let htmlString = response.data.result;
            data = [
                {
                    title: "Breakdown",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > .rf_header, #Year')
                },
                {
                    title: "Cash Flows from Operations",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_s1')
                },
                {
                    title: "Net Income",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i1')
                },
                {
                    title: "Depreciation and Amortization",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i2')
                },
                {
                    title: "Investment/Asset Impairment Charges",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i4')
                },
                {
                    title: "Investment Losses (gains)",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i5')
                },
                {
                    title: "Deferred Income Taxes",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i6')
                },
                {
                    title: "Stock Based Compensation",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i10')
                },
                {
                    title: "Change in Working Capital",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i15')
                },
                {
                    title: "Accounts Receivable",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i16')
                },
                {
                    title: "Inventory",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i17')
                },
                {
                    title: "Accounts Payable",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i19')
                },
                {
                    title: "Other Working Capital",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i23')
                },
                {
                    title: "Other Non-Cash Items",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i30')
                },
                {
                    title: "Net Cash from Operations",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_tts1')
                },
                {
                    title: "Cash Flows from Investing",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_s2')
                },
                {
                    title: "Investments in Property, Plant, and Equipment",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i31')
                },
                {
                    title: "Acquisitions, Net",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i33')
                },
                {
                    title: "Purchases of Investments",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i34')
                },
                {
                    title: "Sales/Maturities of Investments",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i35')
                },
                {
                    title: "Other Investing Activities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i60')
                },
                {
                    title: "Net Cash Used for Investments",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_tts2')
                },
                {
                    title: "Cash Flows from Financing",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_s3')
                },
                {
                    title: "Debt Issued",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i61')
                },
                {
                    title: "Debt Repayment",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i62')
                },
                {
                    title: "Common Stock Issued",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i66')
                },
                {
                    title: "Common Stock Repurchased",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i67')
                },
                {
                    title: "Dividends Paid",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i69')
                },
                {
                    title: "Other Financing Activities",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_i90')
                },
                {
                    title: "Net Cash from Financing",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > r_content, #data_tts3')
                },
                {
                    title: "Effects of Exchange Rate Changes",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i91')
                },
                {
                    title: "Net Change in Cash",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i93')
                },
                {
                    title: "Beginning Cash Position",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i94')
                },
                {
                    title: "Ending Cash Position",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i95')
                },
                {
                    title: "Operating Cash Flow",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i100')
                },
                {
                    title: "Capital Expenditures",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i96')
                },
                {
                    title: "Free Cash Flow",
                    list: toArray(htmlString, '.r_xcmenu.rf_table > #data_i97')
                },
            ]
            res.send(data)
        }).catch(err => {
            res.status(400).send({error: true, message: "Something weng wrong. The ticker entered may not exist"})
        })
})

router.get("/api/v1/company-data/metadata/:ticker", (req, res) => {
    let data = []
    axios.get(config.keyRatiosURI + `&t=${req.params.ticker}`)
        .then(response => {
            let $ = cheerio.load(response.data["ksContent"])
            res.send($("div").html())
        }).catch(err => {
            res.status(400).send({error: true, message: "Something weng wrong. The ticker entered may not exist"})
        })
})

module.exports = router;