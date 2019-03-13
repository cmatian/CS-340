module.exports = function() {
    let express = require('express');
    let router = express.Router();

    let getBeings = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT beingid, CONCAT(fname, ' ', lname) AS name FROM BEING WHERE force_sensitive=1", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.being = results;
            complete();
        });
    };

    let getForcePowers = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT forceid, name FROM FORCE_POWER", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.forcepower = results;
            complete();
        });
    };

    let getForceUsers = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT A.beingid, CONCAT(fname, ' ', lname) AS beingname, A.forceid, F.name AS forcename FROM FORCE_USER A INNER JOIN BEING B ON B.beingid = A.beingid INNER JOIN FORCE_POWER F ON F.forceid = A.forceid ORDER BY beingid", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.forceuser = results;
            complete();
        });
    };

    // Render Force User
    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.forceuser.js"; // Set any page specific scripts here
        getBeings(req, mysql, context, complete);
        getForcePowers(req, mysql, context, complete);
        getForceUsers(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 3) {
                res.render('forceuser', context);
            }
        }
    });

    // Create a Force User
    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO FORCE_USER (beingid, forceid) VALUES(?, ?)";
        let inserts = [req.body.forceuser_beingid, req.body.forceuser_forceid];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/forceuser');
        });
    });

    // Update a Force User
    router.put('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "UPDATE FORCE_USER SET beingid=?, forceid=? WHERE (forceid=? AND beingid=?)";
        let inserts = [req.body.forceuser_beingid, req.body.forceuser_forceid, req.body.forceuser_oldforceid, req.body.forceuser_beingid];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    // Delete a Force User
    router.delete('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = 'DELETE FROM FORCE_USER WHERE forceid=? AND beingid=?';
        let inserts = [req.body.forceuser_forceid, req.body.forceuser_beingid];
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