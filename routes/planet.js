module.exports = function() {
    let express = require('express');
    let router = express.Router();

    // Get Factions Query
    let getFactions = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT factionid, name FROM FACTION", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.faction = results;
            complete();
        });
    };

    // Get Planets Query
    let getPlanets = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT planetid, P.name AS name, population, FORMAT(population, 0) AS population_view, owner, (CASE WHEN F.name IS NULL THEN 'Unknown' ELSE F.name END) AS ownername FROM PLANET P LEFT JOIN FACTION F ON F.factionid = P.owner ORDER BY planetid", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.planet = results;
            complete();
        });
    };

    // Route Get Planets Page
    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.planet.js"; // Set any page specific scripts here
        getFactions(res, mysql, context, complete);
        getPlanets(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 2) {
                res.render('planet', context);
            }
        }
    });

    // Post a new planet
    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        console.log(req.body);
        let sql = "INSERT INTO PLANET (name, population, owner) VALUES(?, ?, ?)";
        let inserts = [req.body.planet_name, req.body.planet_pop, req.body.planet_owner];
        if(inserts[2] === 'NULL' || inserts[2] === 'null') {
            inserts[2] = null;
        }
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/planet');
        });
    });

    // Update a Planet
    router.put('/', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "UPDATE PLANET SET name=?, population=?, owner=? WHERE planetid=?";
        let inserts = [req.body.planet_name, req.body.planet_pop, req.body.planet_owner, req.body.planet_planetid];
        if(inserts[2] === 'NULL' || inserts[2] === 'null') {
            inserts[2] = null;
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

    // Delete a Planet
    router.delete('/', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM PLANET WHERE planetid=?";
        let inserts = [req.body.planet_planetid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.end();
            }
            else{
                res.status(202).end();
            }
        })
    });

    return router;
}();