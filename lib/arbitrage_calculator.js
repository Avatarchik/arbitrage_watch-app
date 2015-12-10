var _ = require('lodash');

module.exports = function(home, away, draw) {
    var arbPercent = (1/home) + (1/away) + (draw > 0 ? (1/draw) : 0);
    return arbPercent;
};
