module.exports = function(){
    let express = require('express');
    let router = express.Router();

    let getFactions = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT factionid, name, numMembers, FORMAT(numMembers, 0) AS numMembers_view, leader, (CASE WHEN leader IS NULL THEN 'Unknown' ELSE CONCAT(fname, ' ', lname) END) AS leader_string FROM FACTION LEFT JOIN BEING ON FACTION.leader = BEING.beingid", (error, results, fields) => {
            if(error){
                console.log(JSON.stringify(error));
                res.end();
            }
            context.faction = results;
            complete();
        });
    };

    let getBeings = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT beingid, CONCAT(fname, ' ', lname) AS name, race FROM BEING", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.being = results;
            complete();
        });
    };

    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.faction.js";
        getBeings(req, mysql, context, complete);
        getFactions(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 2) {
                res.render('faction', context);
            }
        }
    });

    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO FACTION (name, numMembers, leader) VALUES (?,?,?)";
        let inserts = [req.body.faction_name, req.body.faction_numMembers, req.body.faction_leader];
        if(inserts[2] === 'NULL' || inserts[2] === 'null') {
            inserts[2] = null;
        }
        console.log(inserts);
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/faction');
        });
    });

    router.put('/', function(req, res) {
        let mysql = req.app.get('mysql');
        console.log(req.body);
        let sql = "UPDATE FACTION SET name=?, numMembers=?, leader=? WHERE factionid=?";
        let inserts = [req.body.faction_name, req.body.faction_numMembers, req.body.faction_leader, req.body.faction_factionid];
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

    router.delete('/', function(req, res){
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM FACTION WHERE factionid=?";
        let inserts = [req.body.faction_factionid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(200).end();
            }
        })
    });

    return router;
}();
