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

    let getShips = (res, mysql, context, complete) => {
        mysql.pool.query("SELECT shipid, name, model, make, B.beingid AS captain, (CASE WHEN captain IS NULL THEN 'Unassigned' ELSE CONCAT(fname, ' ', lname) END) as captain_string, capacity FROM SHIP S LEFT JOIN BEING B ON B.beingid = S.captain", (error, results, fields) => {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            context.ship = results;
            complete();
        })
    };

    router.get('/', (req, res) => {
        let count = 0,
            context = {},
            mysql = req.app.get('mysql');
        context.jsscripts = "./js/helpers.ship.js"; // Set any page specific scripts here
        getBeings(req, mysql, context, complete);
        getShips(req, mysql, context, complete);
        function complete() {
            count++;
            if(count >= 2) {
                res.render('ship', context);
            }
        }
    });

    router.post('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "INSERT INTO SHIP (name, model, make, captain, capacity) VALUES(?, ?, ?, ?, ?)";
        let inserts = [req.body.ship_name, req.body.ship_model, req.body.ship_make, req.body.ship_captain, req.body.ship_capacity];
        // Intercept the Insert for captain and cast it as a null value rather than a null string
        // We need to do this because the foreign key constraint expects a null or int, not a string called 'NULL'
        if(inserts[3] === "NULL" || inserts[3] === "null") {
            inserts[3] = null;
        }
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if (error) {
                console.log(JSON.stringify(error));
                res.end();
            }
            res.redirect('/ship');
        });
    });

    // Update an existing Ship
    router.put('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "UPDATE SHIP SET name=?, model=?, make=?, captain=?, capacity=? WHERE shipid=?";
        let inserts = [req.body.ship_name, req.body.ship_model, req.body.ship_make, req.body.ship_captain, req.body.ship_capacity, req.body.ship_shipid];
        if(inserts[3] === "NULL" || inserts[3] === "null") {
            inserts[3] = null;
        }
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    router.delete('/', (req, res) => {
        let mysql = req.app.get('mysql');
        let sql = "DELETE FROM SHIP WHERE shipid=?";
        let inserts = [req.body.ship_shipid];
        sql = mysql.pool.query(sql, inserts, function(error, results, field) {
            if(error) {
                console.log(JSON.stringify(error));
                res.end();
            } else {
                res.status(202).end();
            }
        });
    });

    return router;
}();