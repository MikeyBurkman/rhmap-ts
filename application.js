
// This is tempoary just to check something

var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.json('200', {'deployed': true});
});

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8004;
app.listen(port, function() {
log.info('App started at: %s on port %d', new Date(), port);
});