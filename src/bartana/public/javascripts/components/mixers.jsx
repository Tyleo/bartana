let Mui = require('material-ui');
let React = require('react');

let Mixer = require('./mixer.jsx');

class Mixers extends React.Component {
    constructor() {
        super();
        this.styles = {
            root: {
                marginTop: '72pt'
            }
        }
    }

    render() {
        return (
            <div style={this.styles.root}>
                <h1>Mixers</h1>
                <Mixer text="Hello" />
            </div>);
    }
}

module.exports = Mixers;
