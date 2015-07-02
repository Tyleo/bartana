var Data = require('../private/javascripts/data');
var Express = require('express');
var Router = Express.Router();
var RunPumps = require('../private/javascripts/run_pumps');

Router.post('/', function (req, res) {
    var dataJson = req.body.dataJson;
    var data = JSON.parse(dataJson);

    Data.GetServerMixInfo(
        data.components,
        function (mixInfoArray)
        {
            RunPumps(
                data.fillAmount,
                mixInfoArray,
                function ()
                {
                    res.end();
                }
            );
        }
    );
});

module.exports = Router;
