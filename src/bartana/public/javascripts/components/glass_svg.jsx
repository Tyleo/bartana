let React = require('react');
let TinyColor = require('tinycolor2');

let Config = require('../../json/config.json');
let GlassType = require('../enums/glass_type.jsx');

class GlassSvg extends React.Component {
    constructor(props) {
        super(props);

        this._mixRender = this._mixRender.bind(this);
        this._stackRender = this._stackRender.bind(this);
        this._createLiquids = this._createLiquids.bind(this);
        this._createLiquid = this._createLiquid.bind(this);
        this._glassRender = this._glassRender.bind(this);
        this._calcMixColor = this._calcMixColor.bind(this);
        this._getSortedComponents = this._getSortedComponents.bind(this);
        this._calculatePoints = this._calculatePoints.bind(this);

        this.sortedComponents = this._getSortedComponents();
    }

    render() {
        this.totalParts = GlassSvg._calculateTotalParts(this.props.components);

        let glassType = this.props.glassType;
        if (glassType === GlassType.Mixed) {
            return this._mixRender();
        } else if (glassType === GlassType.Stacked) {
            return this._stackRender();
        }

        return this._mixRender();
    }

    static _calculateTotalParts(components) {
        let totalParts = 0;
        for (let i = 0; i < components.length; i++) {
            totalParts += components[i].parts;
        }
        return totalParts;
    }

    _mixRender() {
        let fillColorHex = this._calcMixColor();
        let fillColor = TinyColor(fillColorHex);
        let otherColor = GlassSvg._calcOtherColor(fillColor);
        let otherColorHex = otherColor.toHexString();

        let points = this._calculatePoints(1).points;

        return (
            <svg version="1.2"
                 baseProfile="tiny"
                 x="0px"
                 y="0px"
                 width={this.props.width}
                 height={this.props.height}
                 viewBox="0 0 100 100">
                <g id="Liquid">
                    <polygon fill={fillColorHex}
                             stroke={otherColorHex}
                             stroke-miterlimit="10"
                             points={points} />
                </g>
                {this._glassRender()}
            </svg>);
    }

    _stackRender() {
        return (
            <svg version="1.2"
                 baseProfile="tiny"
                 x="0px"
                 y="0px"
                 width={this.props.width}
                 height={this.props.height}
                 viewBox="0 0 100 100">
                {this._createLiquids()}
                {this._glassRender()}
            </svg>);
    }

    _createLiquids() {
        let liquids = [];
        let previousTop = 0;
        for (let i = this.props.components.length - 1; i >= 0; i--) {
            let component = this.props.components[i];
            let liquidData = this._createLiquid(component, previousTop);
            liquids.push(liquidData.result);
            previousTop = liquidData.top;
        }
        return liquids;
    }

    _createLiquid(component, bottom) {
        let amount = component.parts / this.totalParts;
        let pointsData = this._calculatePoints(amount, bottom);
        let points = pointsData.points;

        let result =
            (<g id={component.name}>
                <polygon fill={component.color}
                         stroke="none"
                         stroke-miterlimit="10"
                         points={points} />
            </g>);

        return {
            top: pointsData.top,
            result: result
        };
    }

    _glassRender() {
        return (
            <g id="Glass">
                <polygon fill="none"
                         stroke="#FFFFFF"
                         stroke-miterlimit="10"
                         points="1,1 99,1 80,99 20,99" />
            </g>);
    }

    _calcMixColor() {
        let components = this.props.components;
        let red = 0;
        let blue = 0;
        let green = 0;

        let totalParts = 0;
        for (let i = 0; i < components.length; i++) {
            let component = components[i];
            totalParts += component.parts;
        }

        for (let i = 0; i < components.length; i++) {
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

    _getSortedComponents() {
        let components = this.props.components;
        components.sort(
            function (lhs, rhs) {
                return lhs.parts - rhs.parts;
            }
        );
        return components;
    }

    _calculatePoints(fillAmount, bottom) {
        // The maximum properties of any glass
        let veryBottom = 99;
        let veryTop = 1;
        let veryVerticalRange = veryBottom - veryTop;
        let veryOuterLeft = 1;
        let veryOuterRight = 99;
        let veryInnerLeft = 20;
        let veryInnerRight = 80;
        let slopeRight = (veryOuterRight - veryInnerRight) / veryVerticalRange;

        // The maximum properties of this glass
        let realRangeModifier = this.props.drinkMilliliters / this.props.glassMilliliters;
        let realVerticalRange = realRangeModifier * veryVerticalRange;
        let realBottom = veryBottom;
        let realTop =  veryBottom - realVerticalRange;

        // The properties of this component
        let thisVerticalRange = realVerticalRange * fillAmount;
        let thisBottom;
        if (!bottom) {
            thisBottom = realBottom;
        } else {
            thisBottom = bottom;
        }
        let thisTop = thisBottom - thisVerticalRange;

        let veryBottomToThisBottom = veryBottom - thisBottom;
        let veryBottomToThisTop = veryBottom - thisTop;

        let thisInnerRight = veryInnerRight + slopeRight * veryBottomToThisBottom;
        let thisOuterRight = veryInnerRight + slopeRight * veryBottomToThisTop;
        let thisInnerLeft = veryInnerLeft - slopeRight * veryBottomToThisBottom;
        let thisOuterLeft = veryInnerLeft - slopeRight * veryBottomToThisTop;

        let pointsString =
            thisOuterLeft.toString() + ',' + thisTop.toString() + ' ' +
            thisOuterRight.toString() + ',' + thisTop.toString() + ' ' +
            thisInnerRight.toString() + ',' + thisBottom.toString() + ' ' +
            thisInnerLeft.toString() + ',' + thisBottom.toString();

        return {
            points: pointsString,
            top: thisTop
        };
    }

    static _calcOtherColor(color) {
        if (color.isLight())
        {
            return color.darken(15);
        }

        return color.brighten(15);
    }
}

GlassSvg.propTypes = {
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    glassMilliliters: React.PropTypes.number,
    drinkMilliliters: React.PropTypes.number,
    glassType: React.PropTypes.object,
    components: React.PropTypes.array
};

GlassSvg.defaultProps = {
    width: '100px',
    height: '100px',
    glassMilliliters: Config['glassMilliliters'],
    drinkMilliliters: Config['drinkMilliliters'],
    glassType: GlassType.Mixed,
    components: []
};

module.exports = GlassSvg;
