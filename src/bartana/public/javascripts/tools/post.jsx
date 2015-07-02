let $ = require('jquery');

let Mix = function (components, fillAmount) {
    $.post(
        '/mix',
        {
            dataJson: JSON.stringify(
                {
                    components: components,
                    fillAmount: fillAmount,
                }
            )
        }
    );
};

module.exports.Mix = Mix;
