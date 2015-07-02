let Mui = require('material-ui');
let React = require('react');

let LeftNav = Mui.LeftNav;
let MenuItem = Mui.MenuItem;

class BartanaLeftNav extends React.Component {
    constructor() {
        super();

        this.toggle = this.toggle.bind(this);
        this._onLeftNavChange = this._onLeftNavChange.bind(this);

        this.menuItems = [
            {
                route: 'drinks',
                text: 'Drinks'
            },
            {
                route: 'mixers',
                text: 'Mixers'
            }
        ];
    };

    render() {
        return (
            <LeftNav ref="leftNav"
                     docked={false}
                     menuItems={this.menuItems}
                     onChange={this._onLeftNavChange} />);
    };

    toggle() {
        this.refs.leftNav.toggle();
    }

    _onLeftNavChange(e, key, payload) {
        this.context.router.transitionTo(payload.route);
    }
}

BartanaLeftNav.contextTypes = {
    router: React.PropTypes.func
};

module.exports = BartanaLeftNav;
