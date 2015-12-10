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

                    if (i !== 3 && away !== 'OFF')
                        Match.addOdds( match, null, away, home );
                });

                matches.push(match);
            });

            callback(null, matches);
        }
    );
};
