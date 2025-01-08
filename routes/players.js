const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', [
    check('search_text').notEmpty()
], function (req, res, next) {
    // Check for validation errors
    const search_result = req.sanitize(req.query.search_text);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are validation errors, redirect to the search page
        return res.redirect('./search'); // Redirect back to the search page
    }

    // If valid, proceed to search the database
    let sqlquery = "SELECT tp.PlayerID, tp.FirstName, tp.LastName, tp.Age, tp.Height, tp.Weight, tp.Country, tp.Handedness, " +
        "ps.MatchesPlayed, ps.MatchesWon, ps.Aces, ps.DoubleFaults, ps.BreakPointsSaved " +
        "FROM TennisPlayers tp " +
        "LEFT JOIN PlayerStatistics ps ON tp.PlayerID = ps.PlayerID " +
        "WHERE tp.FirstName LIKE ?;";
    db.query(sqlquery, [`%${search_result}%`], (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("list.ejs", { availablePlayers: result });
    })
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT tp.*, ps.* FROM TennisPlayers tp " +
                   "LEFT JOIN PlayerStatistics ps ON tp.PlayerID = ps.PlayerID"
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availablePlayers:result})
     })
})

router.get('/addplayer', function (req, res, next) {
    res.render('addplayer.ejs')
})

router.post('/playeradded', [
    // Validate required fields
    check('firstName').notEmpty(),
    check('lastName').notEmpty(),
    check('age').notEmpty().isInt({ min: 0 }),
    check('height').notEmpty().isFloat({ min: 0 }),
    check('weight').notEmpty().isFloat({ min: 0 }),
    check('country').notEmpty(),
    check('ranking').notEmpty().isInt({ min: 1 }),
    check('handedness').isIn(['Right', 'Left', 'Ambidextrous'])
], function (req, res, next) {
    // Sanitize inputs
    const firstName = req.sanitize(req.body.firstName);
    const lastName = req.sanitize(req.body.lastName);
    const age = req.sanitize(req.body.age);
    const height = req.sanitize(req.body.height);
    const weight = req.sanitize(req.body.weight);
    const country = req.sanitize(req.body.country);
    const ranking = req.sanitize(req.body.ranking);
    const handedness = req.sanitize(req.body.handedness);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./addplayer');
    } else {
        // Insert player data
        let sqlquery = "INSERT INTO TennisPlayers (FirstName, LastName, Age, Height, Weight, Country, Ranking, Handedness) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        let newrecord = [firstName, lastName, age, height, weight, country, ranking, handedness];
        
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err);
            }
            
            // Generate random statistics for the new player
            const playerId = result.insertId; // Get the ID of the newly inserted player
            const matchesPlayed = Math.floor(Math.random() * 100) + 50; // 50-150 matches
            const matchesWon = Math.floor(Math.random() * matchesPlayed); // Won matches can't exceed played matches
            const aces = Math.floor(Math.random() * 200) + 1; // 1-200 aces
            const doubleFaults = Math.floor(Math.random() * 100) + 1; // 1-100 double faults
            const breakPointsSaved = Math.floor(Math.random() * 150) + 1; // 1-150 break points saved

            // Insert statistics into PlayerStatistics table
            const statsQuery = "INSERT INTO PlayerStatistics (PlayerID, MatchesPlayed, MatchesWon, Aces, DoubleFaults, BreakPointsSaved) VALUES (?, ?, ?, ?, ?, ?)";
            const statsRecord = [playerId, matchesPlayed, matchesWon, aces, doubleFaults, breakPointsSaved];

            db.query(statsQuery, statsRecord, (statsErr, statsResult) => {
                if (statsErr) {
                    return next(statsErr);
                }
                res.send(`Player ${firstName} ${lastName} has been added to the database with generated statistics`);
            });
        });
    }
})


router.get('/youngplayers', function(req, res, next) {
    let sqlquery = "SELECT * FROM TennisPlayers WHERE age < 25"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("players.ejs", {availablePlayers:result})
    })
})


// Export the router object so index.js can access it
module.exports = router