let Mui = require('material-ui');
let React = require('react');

let Get = require('../tools/get.jsx');
let Style = require('../styles/style.jsx');
let StyleMixer = require('../tools/style_mixer.jsx');

let Drink = require('./drink.jsx');
let Styles = Mui.Styles;
let Typography = Styles.Typography;

class Drinks extends React.Component {
    constructor() {
        super();

        this._drinkElements = this._drinkElements.bind(this);

        this.state = {
            drinks: []
        };

        this.styles = {
            headline: StyleMixer.Mix(
                Style.h1,
                {
                    textAlign: 'left',
                    margin: '16pt',
                    marginBotttom: '16pt',
                }
            )
        };
    }

    componentDidMount() {
        let self = this;

        Get.GetDrinks(
            function (drinks) {
                self.setState({ drinks: drinks });
            }
        );
    }

    render() {
        let drinkElements = this._drinkElements();

        return (
            <div style={Style.cardContainer}>
                    {drinkElements}
            </div>);
    }

    _drinkElements() {
        let drinkElements = this.state.drinks.map(
            function (drink) {
                return (<Drink drink={drink} />);
            }
         );

        return drinkElements;
    }
}

module.exports = Drinks;
