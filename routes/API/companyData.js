const express = require("express");
const cheerio = require('cheerio');
const axios = require('axios');

const config = require("../../config/keys");
const searchQuery = require('../../middleware/search');

const router = express.Router();

router.get("/api/v1/company-data/metadata/:ticker", (req, res) => {
    let data = []
    axios.get(config.keyRatiosURI + `&t=${req.params.ticker}`)
        .then(response => {
            let $ = cheerio.load(response.data["ksContent"])
            res.send($("div").html())
        }).catch(err => {
            res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
        })
})


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


// GET keyRatios
router.get("/api/v1/company-data/keyratios/:performanceid/details", (req, res) => {
    axios.get(`${config.SAL_SERVICE}/keyratios/${req.params.performanceid}/data?&clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY
        },
    }).then(response => {
        res.json(response.data)
    }).catch(err => {
        console.log(err)
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
        }),
            res.json(data)
    }).catch(err => {
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

function inOrderTraversal(array, years, slice=5) {
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

// GET Financials
router.get("/api/v1/company-data/:financials/:performanceid/details", (req, res) => {
    let data = []
    axios.get(`${config.SAL_SERVICE}/newfinancials/${req.params.performanceid}/${req.params.financials}/detail?dataType=${req.query.dataType || "A"}&reportType=${req.query.reportType || "A"}&locale=en&clientId=MDC&benchmarkId=category&version=3.31.0`, {
        headers: {
            'apikey': config.X_API_KEY,
            'x-api-realtime-e': config.X_API_REALTIME_E
        },
    }).then(response => {
        let dataCopy = [...response.data.rows]
        let years = [...response.data.columnDefs]
        let result = inOrderTraversal(dataCopy, years)
        res.json(result)
    }).catch(err => {
        console.log(err)
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// GET keyratios/valuations
router.get("/api/v1/company-data/keyratios/valuation/:performanceid/details", (req, res) => {
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
        res.json(result1.concat(result2))
    }).catch(err => {
        console.log(err)
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

// GET keyratios/operating Performance
router.get("/api/v1/company-data/keyratios/operatingperformance/:performanceid/details", (req, res) => {
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
        res.json(result1.concat(result2))
    }).catch(err => {
        console.log(err)
        res.status(400).send({ error: true, message: "Something weng wrong. The ticker entered may not exist" })
    })
})

module.exports = router;