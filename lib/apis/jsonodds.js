var _       = require('lodash');
var request = require('request');



module.exports = function() {
    var options = {
        url: 'https://jsonodds.com/api/odds/nfl',
        headers: {
            'JsonOdds-API-Key': 'd702d2c0-4b46-41c5-9b66-e0fcc2014c4b'
        }
    };

    request(options, function(error, response, body) {
        if (error || response.statusCode !== 200)
            throw error;

        var x = {};

        var results = JSON.parse(body);
        _.each(results, function(match) {
            var id = match.Odds[0].EventID;

            x[id] = x[id] ? x[id] + 1 : 1;
            var odds = {
                home: _.map(match.Odds, function(obj) {
                    var odds = (obj.MoneyLineHome > 0) ? ((obj.MoneyLineHome / 100) + 1) : ((100 / Math.abs(obj.MoneyLineHome)) + 1);
                    return {
                        siteId: obj.SiteID,
                        odds: odds,
                        decimal: (1 / odds)
                    };
                }),
                away: _.map(match.Odds, function(obj) {
                    var odds = (obj.MoneyLineAway > 0) ? ((obj.MoneyLineAway / 100) + 1) : ((100 / Math.abs(obj.MoneyLineAway)) + 1);
                    return {
                        siteId: obj.SiteID,
                        odds: odds,
                        decimal: (1 / odds)
                    };
                })
            };



            var highs = {
                home: _.reduce(odds.home, function(result, obj) {
                    return result.odds < obj.odds ? obj : result;
                }),
                away: _.reduce(odds.away, function(result, obj) {
                    return result.odds < obj.odds ? obj : result;
                })
            };



            var arbDecimal = highs.home.decimal + highs.away.decimal;
            var investment = 1000;
            if (0 < arbDecimal && arbDecimal < 1) {
                console.log();
                console.log('Arbitrage alert (', (1 - arbDecimal) * 100, ')');
                console.log('Investment : Profit  -- ', investment, ':', (investment/arbDecimal) - investment);
                console.log(match.HomeTeam, 'vs.', match.AwayTeam, '(', match.ID, ')');
                console.log();
            }
        });

    });
};
