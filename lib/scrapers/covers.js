var _       = require('lodash');
var async   = require('async');
var jsdom   = require('jsdom');
var request = require('request');
var Match   = require('../models/match');



module.exports = function(callback) {
    var urls = {
        nfl   : 'http://www.covers.com/odds/football/nfl-moneyline-odds.aspx',
        ncaaf : 'http://www.covers.com/odds/football/college-football-moneyline-odds.aspx',
        nba   : 'http://www.covers.com/odds/basketball/nba-moneyline-odds.aspx',
        nhl   : 'http://www.covers.com/odds/hockey/nhl-odds.aspx',
        ncaab : 'http://www.covers.com/odds/basketball/college-basketball-moneyline-odds.aspx'
    };

    var originalCallback = callback;
    async.forEachOf(urls, function(url, key, callback) {
        jsdom.env(
            url,
            ['https://code.jquery.com/jquery-2.1.4.min.js'],
            function(err, window) {
                var $       = window.$;
                var matches = [];

                $('table > tbody > tr.bg_row').each(function() {
                    var match = Match.create(
                        key,
                        $(this).find('.team_away > strong').text().trim(),
                        $(this).find('.team_home > strong').text().trim(),
                        $(this).find('.odds_table_row').first().find('.team_away').text().trim() + ' @ ' + $(this).find('.odds_table_row').first().find('.team_home').text().trim()
                    );

                    $(this).children('td.offshore_top').each(function(i) {
                        var away = $(this).find('.line_top > a').text().trim();
                        var home = $(this).find('.offshore > a').text().trim();

                        if (away === 'OFF')
                            return;
                        if (i === 0)
                            return;
                        if (i === 4)
                            return;
                        else
                            Match.addOdds( match, indexToSource(i), away, home );
                    });

                    matches.push(match);
                });

                originalCallback(null, matches);
                callback();
            }
        );
    }, function(err) {
        if (err) callback(err);
    });
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
