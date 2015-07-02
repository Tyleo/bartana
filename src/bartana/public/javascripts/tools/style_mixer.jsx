let Mix = function (baseStyle, childStyle) {
    var newStyle = {};
    for (var attrName in baseStyle) {
        if (baseStyle.hasOwnProperty(attrName)) {
            newStyle[attrName] = baseStyle[attrName];
        }
    }
    for (var attrName in childStyle) {
        if (childStyle.hasOwnProperty(attrName)) {
            newStyle[attrName] = childStyle[attrName];
        }
    }
    return newStyle;
};

module.exports.Mix = Mix;
