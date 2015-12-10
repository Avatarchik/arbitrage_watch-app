var _ = require('lodash');

module.exports = {
    calculate: function(board, callback) {
        var away = {};
        var home = {};

        away.high = _.max(board, function(val) {
            return val.odds.away.decimal;
        });
        home.high = _.max(board, function(val) {
            return val.odds.home.decimal;
        });

        away.decimal = 1 / away.high.odds.away.decimal;
        home.decimal = 1 / home.high.odds.home.decimal;

        var scrape = 1 - (away.decimal + home.decimal);

        if (scrape > 0)
            callback(null, scrape * 100);
        else
            callback(null, null);
    }
};
