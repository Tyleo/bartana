let Mui = require('material-ui');

let Styles = Mui.Styles;
let Typography = Styles.Typography;

let Style = {
    cardContainer: {
        textAlign: 'center',
        display: 'inline-block',
        width: '100%',
        minHeight: '100vh',
        marginTop: '32px'
    },
    h1: {
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: '0',
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textFullWhite
    },
    h2: {
        fontSize: '22px',
        letterSpacing: '0',
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textFullWhite,
        textAlign: 'left',
        lineHeight: '0px'
    },
    buttonText: {
        fontSize: '14px',
        fontWeight: Typography.fontWeightNormal,
        color: Typography.textFullWhite
    }
};

module.exports = Style;
