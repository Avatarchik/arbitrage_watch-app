// {
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

    create: function(away, home, time) {
        return {
            away: away,
            home: home,
            time: Date.now(),
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
