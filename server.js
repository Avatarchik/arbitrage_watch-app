var _         = require('lodash');
var covers    = require('./lib/scrapers/covers');
var Arbitrage = require('./lib/models/arbitrage');



covers(function(err, data) {
    if (err) throw err;

    _.each(data, function(match) {
        Arbitrage.calculate(match.board, 1000, function(err, data) {
            if (data) {
                console.log(match.sport.toUpperCase(), ':', match.away, 'vs', match.home, ':', match.time);
                console.log(JSON.stringify(data, null, 4));
                console.log();
            }
        });
    });
});
