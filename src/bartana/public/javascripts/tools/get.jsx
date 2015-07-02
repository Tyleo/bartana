let $ = require('jquery');

let GetDrinks = function (drinksCallback) {
    $.getJSON('/drinks',
              null,
              function (data, textStatus, jqXHR) {
                  data.sort(function (lhs, rhs) {
                      return lhs.name.localeCompare(rhs.name);
                  });
                  if (drinksCallback) {
                      drinksCallback(data);
                  }
              }
    );
};

module.exports.GetDrinks = GetDrinks;
