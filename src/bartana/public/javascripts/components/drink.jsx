let Mui = require('material-ui');
let React = require('react');
let TinyColor = require('tinycolor2');

let DrinkDialog = require('./drink_dialog.jsx');
let GlassSvg = require('./glass_svg.jsx');
let Style = require('../styles/style.jsx');
let StyleMixer = require('../tools/style_mixer.jsx');

let Paper = Mui.Paper;

class Drink extends React.Component {
    constructor() {
        super();

        this._getColor = this._getColor.bind(this);
        this._onTouchTap = this._onTouchTap.bind(this);

        this.styles = {
            root: {
                // Outer
                display: 'inline-block',
                margin: '16pt',
                marginTop: '0pt',
                marginBottom: '32pt'
            },
            paper: {
                // Inner
                textAlign: 'center',
                height: '10em',
                width: '10em'
            },
            holder: {
                // Outer
                height: '100%',

                // Inner
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            },
            text: StyleMixer.Mix(
                Style.buttonText,
                {
                    // Outer
                    marginBottom: '4pt'
                }
            )
        };
    }

    _getColor() {
        let components = this.props.drink.components;
        let red = 0;
        let blue = 0;
        let green = 0;

        let totalParts = 0;
        for (var i = 0; i < components.length; i++) {
            let component = components[i];
            totalParts += component.parts;
        }

        for (var i = 0; i < components.length; i++) {
            let component = components[i];
            let thisRgb = TinyColor(component.color).toRgb();
            let proportion = component.parts / totalParts;

            red += thisRgb.r * proportion;
            blue += thisRgb.b * proportion;
            green += thisRgb.g * proportion;
        }

        let finalColor =
            TinyColor({ r: red,
                        b: blue,
                        g: green });

        return finalColor.toHexString();
    }

    render() {
        let drinkProp = this.props.drink;
        let color = this._getColor();

        return (
            <div style={this.styles.root}>
                <Paper style={this.styles.paper}
                       onTouchTap={this._onTouchTap}>
                    <div style={this.styles.holder}>
                        <div style={this.styles.text}>{drinkProp.name}</div>
                        <GlassSvg components={drinkProp.components} />
                    </div>
                </Paper>
                <DrinkDialog ref="dialog"
                             drink={this.props.drink} />
            </div>);
    }

    _onTouchTap() {
        this.refs.dialog.show();
    }
}

module.exports = Drink;
