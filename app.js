let express = require('express'),
    handlebars = require('express-handlebars'),
    app = express(),
    bodyParser = require('body-parser');
let mysql = require('./dbcon.js');

app.engine('handlebars', handlebars({
    extname: 'handlebars',
    defaultLayout: 'main',
    helpers: require('./helpers/handlebars.js').helpers
}));

app.set('view engine', 'handlebars');
// Define each view page here
app.use(bodyParser.urlencoded({extended: true}));
app.use('/being', require('./routes/being.js'));
app.use('/planet', require('./routes/planet.js'));
app.use('/allegiance', require('./routes/allegiance.js'));
app.use('/faction', require('./routes/faction.js'));
app.use('/forcepower', require('./routes/forcepower.js'));
app.use('/ship', require('./routes/ship.js'));
app.use('/forceuser', require('./routes/forceuser.js'));
app.use('/', express.static('public'));
app.set('mysql', mysql);
app.set('port', process.argv[2]);

// Resource Request Error
app.use(function(req, res){
  res.status(404);
  res.render('404');
});

// Server Error
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
