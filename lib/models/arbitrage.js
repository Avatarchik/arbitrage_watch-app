var _ = require('lodash');

module.exports = {
    calculate: function(board, maxBet, callback) {
        var away = {};
        var home = {};

        away.high = _.max(board, function(val) {
            return val.odds.away.decimal;
        });
        home.high = _.max(board, function(val) {
            return val.odds.home.decimal;
        });

        if (!away.high.odds || !home.high.odds)
            return callback(null, null);

        away.decimal = 1 / away.high.odds.away.decimal;
        home.decimal = 1 / home.high.odds.home.decimal;

        var scrape = 1 - (away.decimal + home.decimal);

        if (scrape > 0)
            callback(null, {
                scrape: scrape * 100,
                percent: (1 - scrape) * 100,
                profit: (maxBet / (1 - scrape)) - maxBet,
                max_bet: maxBet,
                away: {
                    moneyline: away.high.odds.away.american,
                    source: away.high.source,
                    bet: (maxBet * away.decimal) / (1 - scrape),
                    decimal: away.decimal
                },
                home: {
                    moneyline: home.high.odds.home.american,
                    source: home.high.source,
                    bet: (maxBet * home.decimal) / (1 - scrape),
                    decimal: home.decimal
                }
            });
        else
            callback(null, null);
    }
};
