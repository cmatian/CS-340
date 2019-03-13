module.exports = function() {
    let express = require('express');
    let router = express.Router();

    let getBeings = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT beingid, CONCAT(fname, ' ', lname) AS name FROM BEING", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.being = results;
            complete();
        });
    };

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

    let getAllegiance = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT A.beingid, CONCAT(fname, ' ', lname) AS beingname, A.factionid, F.name AS factionname FROM ALLEGIANCE A INNER JOIN BEING B ON B.beingid = A.beingid INNER JOIN FACTION F ON F.factionid = A.factionid", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.allegiance = results;
            complete();
        });
    };

    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.allegiance.js"; // Set any page specific scripts here
        getBeings(req, mysql, context, complete);
        getFactions(req, mysql, context, complete);
        getAllegiance(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 3) {
                res.render('allegiance', context);
            }
        }
    });

    // Create an Allegiance
    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO ALLEGIANCE (beingid, factionid) VALUES(?, ?)";
        let inserts = [req.body.allegiance_beingid, req.body.allegiance_factionid];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/allegiance');
        });
    });

    // Update an Allegiance
    router.put('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "UPDATE ALLEGIANCE SET beingid=?, factionid=? WHERE (factionid=? AND beingid=?)";
        let inserts = [req.body.allegiance_beingid, req.body.allegiance_factionid, req.body.allegiance_oldfactionid, req.body.allegiance_beingid];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    // Delete an Allegiance
    router.delete('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = 'DELETE FROM ALLEGIANCE WHERE factionid=? AND beingid=?';
        let inserts = [req.body.allegiance_factionid, req.body.allegiance_beingid];
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