let React = require('react');
let Router = require('react-router');

let Master = require('./components/master.jsx');
let Drinks = require('./components/drinks.jsx');
let Mixers = require('./components/mixers.jsx');

let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

let AppRoutes = (
    <Route name="root" path="/" handler={Master}>
        <Route name="drinks" handler={Drinks} />
        <Route name="mixers" handler={Mixers} />

        <DefaultRoute handler={Drinks} />
    </Route>);

module.exports = AppRoutes;
