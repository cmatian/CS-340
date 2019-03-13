module.exports = function() {
    let express = require('express');
    let router = express.Router();

    // Get Force Powers Query
    let getForcePowers = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT forceid, name, lethal, (CASE WHEN lethal THEN 'Lethal' ELSE 'Non-lethal' END) AS lethal_string FROM FORCE_POWER ORDER BY name", (error, results, fields) => {
            if (error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.forcepower = results;
            complete();
        });
    };

    // Get all force powers
    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.forcepower.js"; // Set any page specific scripts here
        getForcePowers(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 1) {
                res.render('forcepower', context);
            }
        }
    });

    router.get('/:param', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.forcepower.js"; // Set any page specific scripts here
        getForcePowers(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 1) {
                console.log('Called GET Param filter 1');
                res.render('forcepower', context);
            }
        }
    });

    // Post a new force power
    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO FORCE_POWER (name, lethal) VALUES(?, ?)";
        let inserts = [req.body.forcepower_name, req.body.forcepower_lethal];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if (error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/forcepower');
        });
    });

    // Update an existing Force Power
    router.put('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "UPDATE FORCE_POWER SET name=?, lethal=? WHERE forceid=?";
        let inserts = [req.body.forcepower_name, req.body.forcepower_lethal, req.body.forcepower_forceid];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    // Delete a Force Power
    router.delete('/', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM FORCE_POWER WHERE forceid=?";
        let inserts = [req.body.forcepower_forceid];
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