// {
//     sport: String
//     away: String,
//     home: String,
//     time: DateTime (UTC)
//     board: [
//         {
//             source: String,
//             odds: Odds
//         }
//     ]
// }
var Odds = require('./odds.js');

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
