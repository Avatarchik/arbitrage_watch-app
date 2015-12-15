// var schema   = require('../schemas/odds');
// var validate = require('ajv')().compile(schema);

module.exports = {
    moneyline: function(away, home) {
        return {
            away: {
                american: away,
                decimal: toDecimal(away)
            },
            home: {
                american: home,
                decimal: toDecimal(home)
            }
        };
    }
};



function toDecimal(american) {
    return (american < 0) ? (100 / Math.abs(american)) + 1 : (american / 100) + 1;
}
