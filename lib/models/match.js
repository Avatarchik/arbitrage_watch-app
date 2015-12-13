var Odds = require('./odds.js');



// var schema   = require('../schemas/match');
// var validate = require('ajv')().compile(schema);

module.exports = {

    create: function(sport, away, home, time) {
        return {
            sport: sport,
            away: away,
            home: home,
            time: time,
            board: [],
            created: Date.now(),
            updated: Date.now()
        };
    },

    addOdds: function(match, source, away, home) {
        match.board.push({
            source: source,
            odds: Odds.moneyline(away, home)
        });
    }

};
