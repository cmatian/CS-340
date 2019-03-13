module.exports = function() {
    let express = require('express');
    let router = express.Router();

    // Get Planets Query
    let getPlanets = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT planetid, name FROM PLANET", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.planet = results;
            complete();
        });
    };

    // Get Beings
    let getBeings = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT beingid, fname, lname, race, homeworld, (CASE WHEN homeworld IS NULL THEN 'Unknown' ELSE name END) AS homeworld_string, force_sensitive, (CASE WHEN force_sensitive THEN 'Yes' ELSE 'No' END) AS force_sensitive_string FROM BEING B LEFT JOIN PLANET P ON P.planetid = B.homeworld", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.being = results;
            complete();
        });
    };

    let getBeingsByFirstName = (req, mysql, context, complete) => {
        let sql = "SELECT beingid, fname, lname, race, homeworld, (CASE WHEN homeworld IS NULL THEN 'Unknown' ELSE name END) AS homeworld_string, force_sensitive, (CASE WHEN force_sensitive THEN 'Yes' ELSE 'No' END) AS force_sensitive_string FROM BEING B LEFT JOIN PLANET P ON P.planetid = B.homeworld WHERE fname=?";
        let inserts = [req.query.fname];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.being = results;
            complete();
        });
    };

    // Render the page
    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.being.js"; // Set any page specific scripts here
        // Perform filtering here using req.query.fname as the key
        if(req.query.fname === undefined || req.query.fname === null) {
            getBeings(req, mysql, context, complete);
        } else {
            getBeingsByFirstName(req, mysql, context, complete);
        }
        getPlanets(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 2) {
                res.render('being', context);
            }
        }
    });

    // Add a being
    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO BEING (fname, lname, race, homeworld, force_sensitive) VALUES(?, ?, ?, ?, ?)";
        let inserts = [req.body.being_fname, req.body.being_lname, req.body.being_race, req.body.being_homeworld, req.body.being_forcesense];
        if(inserts[3] === 'NULL' || inserts[3] === 'null') {
            inserts[3] = null;
        }
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/being');
        });
    });

    // Update a being
    router.put('/', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "UPDATE BEING SET fname=?, lname=?, race=?, homeworld=?, force_sensitive=? WHERE beingid=?";
        let inserts = [req.body.being_fname, req.body.being_lname, req.body.being_race, req.body.being_homeworld, req.body.being_forcesense, req.body.being_beingid];
        if(inserts[3] === 'NULL' || inserts[3] === 'null') {
            inserts[3] = null;
        }
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    // Delete Being
    router.delete('/', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM BEING WHERE beingid=?";
        let inserts = [req.body.being_beingid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(202).end();
            }
        })
    });

    return router;
}();