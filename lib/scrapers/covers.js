var _       = require('lodash');
var jsdom   = require('jsdom');
var request = require('request');
var Match   = require('../models/match');



module.exports = function(callback) {
    jsdom.env(
        'http://www.covers.com/odds/football/nfl-moneyline-odds.aspx',
        ['https://code.jquery.com/jquery-2.1.4.min.js'],
        function(err, window) {
            var $       = window.$;
            var matches = [];

            $('table > tbody > tr.bg_row').each(function() {
                var match = Match.create(
                    $(this).find('.team_away > strong').text().trim(),
                    $(this).find('.team_home > strong').text().trim()
                );

                $(this).children('td.offshore_top').each(function(i) {
                    var away = $(this).find('.line_top > a').text().trim();
                    var home = $(this).find('.offshore > a').text().trim();

                    if (i !== 0 && i !== 4 && away !== 'OFF')
                        Match.addOdds( match, indexToSource(i), away, home );
                });

                matches.push(match);
            });

            callback(null, matches);
        }
    );
};

function indexToSource(index) {
    if (index === 0)
        return 'OPEN';
    else if (index === 1)
        return 'CarbonSports.ag';
    else if (index === 2)
        return 'Sportsbook.ag';
    else if (index === 3)
        return '5Dimes';
    else if (index === 4)
        return 'GTbets.eu';
    else if (index === 5)
        return 'Top Bet';
    else if (index === 6)
        return 'Westgate Las Vegas';
    else
        return null;

}
