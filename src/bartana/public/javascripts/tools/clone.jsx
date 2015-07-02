let $ = require('jquery');

let Clone = function (object) {
    return $.extend(true, {}, object);
}

module.exports = Clone;
