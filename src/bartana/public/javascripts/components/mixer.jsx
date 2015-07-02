let Mui = require('material-ui');
let React = require('react');

let Paper = Mui.Paper;

class Mixer extends React.Component {
    constructor() {
        super();

        this.styles = {
            root: {
                height: '360pt',
                width: '360pt',
                margin: '0 auto',
                marginBottom: '72pt',
                textAlign: 'center'
            }
        };
    }

    render() {
        return (
            <div>
                <Paper style={this.styles.root}><p>{this.props.text}</p></Paper>
            </div>);
    }
}

module.exports = Mixer;
