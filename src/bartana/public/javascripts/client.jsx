(function () {
    let InjectTapEventPlugin = require('react-tap-event-plugin');
    let React = require('react');
    let Router = require('react-router');

    let AppRoutes = require('./app-routes.jsx');

    window.React = React;

    InjectTapEventPlugin();

    Router.create({
        routes: AppRoutes,
        scrollBehavior: Router.ScrollToTopBehavior
    }).run(function (Handler) {
        React.render(<Handler />, document.body);
    });
})();
