let Mui = require('material-ui');
let React = require('react');

let Clone = require('../tools/clone.jsx');
let Config = require('../../json/config.json');
let GlassType = require('../enums/glass_type.jsx');
let Post = require('../tools/post.jsx');
let NewComponent = require('../models/new_component.js');
let Style = require('../styles/style.jsx');
let StyleMixer = require('../tools/style_mixer.jsx');

let GlassSvg = require('./glass_svg.jsx');
let Slider = Mui.Slider;

let Dialog = Mui.Dialog;
let RaisedButton = Mui.RaisedButton;

class DrinkDialog extends React.Component {
    constructor(props) {
        super(props);

        this._getSortedComponents = this._getSortedComponents.bind(this);
        this._createComponentSliders = this._createComponentSliders.bind(this);
        this._createComponentSlider = this._createComponentSlider.bind(this);
        this._createDrinkSlider = this._createDrinkSlider.bind(this);
        this._createInitialState = this._createInitialState.bind(this);
        this._submit = this._submit.bind(this);
        this._mix = this._mix.bind(this);
        this._createMixComponents = this._createMixComponents.bind(this);
        this.show = this.show.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.reset = this.reset.bind(this);

        this.state = this._createInitialState();

        this.styles = {
            holder: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            },
            subHolder: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%'
            },
            sliderContainer: {
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                justifyContent: 'center'
            },
            drinkContainer: {
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                alignItems: 'center',
                justifyContent: 'center'
            },
            sliderDiv: {
                display: 'flex',
                flexDirection: 'column',
            },
            slider: {
                marginTop: '4pt',
                marginBottom: '8pt'
            },
            alcoholText: StyleMixer.Mix(
                Style.h2,
                {
                    marginTop: '20pt'
                }
            ),
            buttonRack: {
                display: 'flex',
                flexDirection: 'row',
                justifySelf: 'center'
            },
            button: {
                marginRight: '12pt'
            }
        };
    }

    _getSortedComponents() {
        let components = this.props.drink.components;
        components.sort(
            function (lhs, rhs) {
                return lhs.parts - rhs.parts;
            }
        );
        return components;
    }

    render() {
        let drink = this.props.drink;
        let components = this.state.components;

        let trueFill = 378.4 * this.state.drinkFill / 100;
        let alcohol = DrinkDialog._calculateAlcoholPercentage(components);
        return (
            <Dialog ref="innerDialog"
                    title={drink.name}
                    onShow={this.reset}>
                <div style={this.styles.holder}>
                    <div style={this.styles.subHolder}>
                        <div style={this.styles.sliderContainer}>
                            {this._createComponentSliders()}
                            {this._createDrinkSlider()}
                        </div>
                        <div style={this.styles.drinkContainer}>
                            <GlassSvg components={components}
                                    glassType={GlassType.Stacked}
                                    width="50%"
                                    height="50%"
                                    drinkMilliliters={trueFill} />
                            <h2 style={this.styles.alcoholText}>Alcohol: {alcohol.toFixed(1)}%</h2>
                        </div>
                    </div>
                    <div style={this.styles.buttonRack}>
                        <RaisedButton label="Mix"
                                      secondary={true}
                                      style={this.styles.button}
                                      onTouchTap={this._submit} />
                        <RaisedButton label="Cancel"
                                      primary={true}
                                      style={this.styles.button}
                                      onTouchTap={this.dismiss} />
                    </div>
                </div>
            </Dialog>);
    }

    static _calculateAlcoholPercentage(components) {
        let totalAlcohol = 0;
        let totalParts = DrinkDialog._calculateTotalParts(components);
        
        if (totalParts === 0) {
            return 0;
        }

        for (let i = 0; i < components.length; i++) {
            let component = components[i];
            let thisPercent = component.parts / totalParts;
            totalAlcohol += thisPercent * component.percentAlcohol;
        }
        return totalAlcohol;
    }

    static _calculateTotalParts(components) {
        let totalParts = 0;
        for (let i = 0; i < components.length; i++) {
            totalParts += components[i].parts;
        }
        return totalParts;
    }

    _createComponentSliders() {
        let componentSliders = [];
        let components = this.state.components;
        for (let i = 0; i < components.length; i++) {
            let component = components[i];
            componentSliders.push(this._createComponentSlider(component, i));
        }
        return componentSliders;
    }

    _createComponentSlider(component, componentIndex) {
        let self = this;

        let onSliderChange = function (e, value) {
            let components = self.state.components;

            component.parts = value;
            components[componentIndex] = component;

            self.setState({ components: components });
        };

        return (
            <div style={this.styles.sliderDiv}>
                <h2 style={Style.h2}>{component.name}: {component.parts} Parts</h2>
                <Slider onChange={onSliderChange}
                        min={0}
                        max={10}
                        value={component.parts}
                        step={1}
                        style={this.styles.slider} />
            </div>);
    }

    _createDrinkSlider() {
        let self = this;

        let onSliderChange = function (e, value) {
            self.setState({drinkFill: value});
        };

        return (
            <div style={this.styles.sliderDiv}>
                <h2 style={Style.h2}>Fill: {this.state.drinkFill}%</h2>
                <Slider onChange={onSliderChange}
                        min={0}
                        max={100}
                        value={this.state.drinkFill}
                        step={1}
                        style={this.styles.slider} />
            </div>);
    }

    _createInitialState() {
        return Clone({
            components: this._getSortedComponents(),
            drinkFill: 100
        });
    }

    _submit() {
        this._mix();
        this.dismiss();
    }

    _mix() {
        let mixComponents = this._createMixComponents();
        Post.Mix(mixComponents, this.state.drinkFill * Config.drinkMilliliters / 100);
    }

    _createMixComponents() {
        let totalParts = DrinkDialog._calculateTotalParts(this.state.components);
        let mixComponents = [];
        for (let i = 0; i < this.state.components.length; i++) {
            let currentComponent = this.state.components[i];
            mixComponents.push(NewComponent(currentComponent.name,
                                            currentComponent.parts / totalParts));
        }
        return mixComponents;
    }

    show() {
        this.refs.innerDialog.show();
    }

    dismiss() {
        this.refs.innerDialog.dismiss();
    }

    reset() {
        this.setState(this._createInitialState());
    }
}

DrinkDialog.propTypes = {
    drink: React.PropTypes.object
};

module.exports = DrinkDialog;
