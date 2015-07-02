let Mui = require('material-ui');
let React = require('react');
let Router = require('react-router');

let BartanaLeftNav = require('./bartana_left_nav.jsx');
let Drinks = require('./drinks.jsx');
let Mixers = require('./mixers.jsx');

let AppBar = Mui.AppBar;
let AppCanvas = Mui.AppCanvas;
let RouteHandler = Router.RouteHandler;
let Styles = Mui.Styles;
let ThemeManager = new Styles.ThemeManager;

class Master extends React.Component {
    constructor() {
        super();

        ThemeManager.setTheme(ThemeManager.types.DARK);

        this._onLeftIconButtonTouchTap = this._onLeftIconButtonTouchTap.bind(this);
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    }

    render() {
        return (
            <AppCanvas>
                <AppBar title="Bartana"
                        showMenuIconButton={false}
                        onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap} />

                <div>
                    <AppBar title="Bartana" showMenuIconButton={false} />
                </div>

                <BartanaLeftNav ref="leftNav" />

                <RouteHandler />
            </AppCanvas>);
    }

    _onLeftIconButtonTouchTap() {
        this.refs.leftNav.toggle();
    }
};

Master.contextTypes = {
    router: React.PropTypes.func
};

Master.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = Master;
