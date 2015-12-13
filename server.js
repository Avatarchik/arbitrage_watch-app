var async     = require('async');
var r         = require('rethinkdb');
var covers    = require('./lib/scrapers/covers');
var Arbitrage = require('./lib/models/arbitrage');



covers(function(err, data) {
    if (err) throw err;

    r.connect()
    .then(function(conn) {

        async.each(data, function(match, callback) {
            Arbitrage.calculate(match.board, 1000, function(err, data) {
                if (data) {
                    console.log(match.sport.toUpperCase(), ':', match.away, 'vs', match.home, ':', match.time);
                    console.log(JSON.stringify(data, null, 4));
                    console.log();
                }
            });
            r.table('match').insert(match, { conflict: 'replace' }).run(conn, callback);
        }, function(err) {
            conn.close();
        });

    });
});
