var Data = require('../private/javascripts/data');
var Express = require('express');
var Router = Express.Router();

Router.get('/', function (req, res) {
    Data.GetClientDrinks(
        function (drinks) {
            res.send(JSON.stringify(drinks));
        }
    );
});

module.exports = Router;
