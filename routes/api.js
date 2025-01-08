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
        let html = '<link rel="stylesheet" href="/main.css">';
        html += '<ul class="products-list">';
        result.forEach(player => {
            html += `<li> ${player.FirstName} - ${player.LastName} - ${player.Age} -`
            html += `${player.Height} - ${player.Weight} - ${player.Country} - ${player.Ranking} -`
            html += `${player.Handedness}`
        })
        html += '</ul>';
        // Set content type to HTML and send response
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    })
})

module.exports = router;
