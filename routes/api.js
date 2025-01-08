const express = require("express")
const router = express.Router()
const request = require('request')

router.get('/', function (req, res, next) {

    // Query database to get all the books
    let sqlquery = "SELECT * FROM TennisPlayers"

    // Execute the sql query
    db.query(sqlquery, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router;
