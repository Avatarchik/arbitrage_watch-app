var _         = require('lodash');
var covers    = require('./lib/scrapers/covers');
var Arbitrage = require('./lib/models/arbitrage');



covers(function(err, data) {
    if (err) throw err;

    _.each(data, function(match) {
        Arbitrage.calculate(match.board, function(err, data) {
            if (data)
                console.log(JSON.stringify(data, null, 4));
        });
    });
});
