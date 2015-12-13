var async     = require('async');
var r         = require('rethinkdb');
var covers    = require('./lib/scrapers/covers');
var Arbitrage = require('./lib/models/arbitrage');


setInterval(function() {
    process.stdout.write('.');
    covers(function(err, data) {
        if (err) throw err;
        r.connect()
        .then(function(conn) {
            async.each(data, function(match, callback) {
                r.table('match').insert(match, { conflict: 'replace' }).run(conn, callback);
            }, function(err) {
                conn.close();
            });
        });
    });
}, 1000 * 60 * 8); // every 8 minutes


r.connect()
.then(function(conn) {
    r.table('match').changes().run(conn, function(err, cursor) {
        cursor.each(function(err, row) {
            var match = row.new_val;
            Arbitrage.calculate(match.board, 1000, function(err, data) {
                if (data) {
                    r.table('arbitrage').insert({
                        sport: match.sport.toUpperCase(),
                        away: match.away,
                        home: match.home,
                        time: match.time,
                        data: data
                    });
                }
            });
        });
    });
});
