var Drinks = require('../json/drinks.json');
var Mixers = require('../json/mixers.json');
var Pins = require('../json/gpio.json');
var Pumps = require('../json/pumps.json');

// Mixer logic

var RemoveDuplicateMixers = function (mixers) {
    var newMixers = [];
    var names = {};
    for (var i = 0; i < mixers.length; i++) {
        var mixer = mixers[i];
        var name = mixer.name;

        if (names.hasOwnProperty(name)) {
            console.log('Mixer Error:');
            console.log('Description: Duplicate mixer');
            console.log('Mixer name: ' + name);
            console.log();

            continue;
        }

        newMixers.push(mixer);
        names[name] = {};
    }

    return newMixers;
}

var IsColorValid = function (color) {
    var colorRegex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

    return colorRegex.test(color);
};

var ValidateMixer = function (mixer) {
    if (!(mixer.hasOwnProperty('name')) ||
        !(typeof (mixer.name) === 'string')) {

        return {
            isError: true,
            message: 'Invalid name'
        };
    }

    if (!(mixer.hasOwnProperty('percentAlcohol')) ||
        !(typeof (mixer.percentAlcohol) === 'number') ||
        !(mixer.percentAlcohol >= 0) ||
        !(mixer.percentAlcohol <= 100)) {

        return {
            isError: true,
            message: 'Invalid percentAlcohol'
        };
    }

    if (!(mixer.hasOwnProperty('color')) ||
        !(typeof (mixer.color) === 'string') ||
        !(IsColorValid(mixer.color))) {

        return {
            isError: true,
            message: 'Invalid color'
        };
    }

    if (!(mixer.hasOwnProperty('isCarbonated')) ||
        !(typeof (mixer.isCarbonated) === 'boolean')) {

        return {
            isError: true,
            message: 'Invlid isCarbonated'
        };
    }

    if (!(mixer.hasOwnProperty('isActive')) ||
        !(typeof (mixer.isActive) === 'boolean')) {

        return {
            isError: true,
            message: 'Invalid isActive'
        };
    }

    return {
        isError: false
    };
};

var GetValidMixers = function () {
    var validMixers = [];
    for (var i = 0; i < Mixers.length; i++) {
        var mixer = Mixers[i];
        var mixerValidation = ValidateMixer(mixer);

        if (mixerValidation.isError) {

            console.log('Mixer Error:');
            console.log('Description: ' + mixerValidation.message);
            console.log('Mixer JSON index: ' + i.toString());
            console.log();
            continue;
        }

        validMixers.push(mixer);
    }

    validMixers = RemoveDuplicateMixers(validMixers);

    return validMixers;
};

// Pump logic

var RemoveDuplicatePumps = function (pumps) {
    var newPumps = [];
    var pins = {};
    for (var i = 0; i < pumps.length; i++) {
        var pump = pumps[i];
        var pin = pump.pin;

        var needsRow = true;
        var needsColumn = true;
        var needsBank = true;

        if (pins.hasOwnProperty(pin.bank)) {

            needsBank = false;

            if (pins[pin.bank].hasOwnProperty(pin.column)) {

                needsColumn = false;

                if (pins[pin.bank][pin.column].hasOwnProperty(pin.row)) {

                    needsRow = false;

                    console.log('Pump Error:');
                    console.log('Description: Duplicate pump');
                    console.log('Pump pin (bank, column, row): ' + pin.bank + ' ' + pin.column + ' ' + pin.row);
                    console.log();

                    continue;
                }
            }
        }

        if (needsBank) {
            var bank = {};
            pins[pin.bank] = bank;
        }

        if (needsColumn) {
            var column = {};
            pins[pin.bank][pin.column] = column;
        }

        if (needsRow) {
            var row = {};
            pins[pin.bank][pin.column][pin.row] = row;
        }

        newPumps.push(pump);
    }

    return newPumps;
};

var DoesPinExist = function (pin) {
    return (
        Pins.hasOwnProperty(pin.bank) &&
        Pins[pin.bank].hasOwnProperty(pin.column) &&
        Pins[pin.bank][pin.column].hasOwnProperty(pin.row)
    );
}

var IsPinValid = function (pin) {
    return (
        pin.hasOwnProperty('bank') &&
        typeof (pin.bank) === 'string' &&

        pin.hasOwnProperty('column') &&
        typeof (pin.column) === 'string' &&

        pin.hasOwnProperty('row') &&
        typeof (pin.row) === 'string' &&

        DoesPinExist(pin)
    );
}

var ValidatePump = function (pump) {
    if (!(pump.hasOwnProperty('pin')) ||
        !(typeof (pump.pin) === 'object') ||
        !(IsPinValid(pump.pin))) {

        return {
            isError: true,
            message: 'Invalid pin'
        };
    }
    
    if (!(pump.hasOwnProperty('mixer')) &&
        !(typeof (pump.mixer) === 'string')) {

        return {
            isError: true,
            message: 'Invalid mixer'
        };
    }
    
    if (!(pump.hasOwnProperty('flowRate')) &&
        !(typeof (pump.flowRate) === 'number')) {

        return {
            isError: true,
            message: 'Invalid flowRate'
        };
    }
    
    if (!(pump.hasOwnProperty('isActive')) &&
        !(typeof (pump.isActive) === 'boolean')) {

        return {
            isError: true,
            message: 'Invalid isActive'
        };
    }

    return {
        isError: false
    };
};

var GetValidPumps = function () {
    var validPumps = [];
    for (var i = 0; i < Pumps.length; i++) {
        var pump = Pumps[i];
        var pumpValidation = ValidatePump(pump);

        if (pumpValidation.isError) {

            console.log('Pump Error:');
            console.log('Description: ' + pumpValidation.message);
            console.log('Pump JSON index: ' + i.toString());
            console.log();
            continue;
        }

        validPumps.push(pump);
    }

    validPumps = RemoveDuplicatePumps(validPumps);

    return validPumps;
};

// Drink logic

var RemoveDuplicateDrinks = function (drinks) {
    var newDrinks = [];
    var names = {};
    for (var i = 0; i < drinks.length; i++) {
        var drink = drinks[i];
        var name = drink.name;
        
        if (names.hasOwnProperty(name)) {
            console.log('Drink Error:');
            console.log('Description: Duplicate drink');
            console.log('Drink name: ' + name);
            console.log();
            
            continue;
        }
        
        newDrinks.push(drink);
        names[name] = {};
    }
    
    return newDrinks;
}

var IsComponentValid = function (component) {
    return (
        component.hasOwnProperty('mixer') &&
        typeof (component.mixer) === 'string' &&

        component.hasOwnProperty('parts') &&
        typeof (component.parts) === 'number'
    );
};

var AreComponentsValid = function (components) {
    for (var i = 0; i < components.length; i++) {
        var component = components[i];
        if (!IsComponentValid(component)) {
            return false;
        }
    }

    return true;
};

var ValidateDrink = function (drink) {
    if (!(drink.hasOwnProperty('name')) ||
        !(typeof (drink.name) === 'string')) {

        return {
            isError: true,
            message: 'Invalid name'
        };
    }

    if (!(drink.hasOwnProperty('components')) ||
        !(typeof (drink.components) === 'object') ||
        !(AreComponentsValid(drink.components))) {

        return {
            isError: true,
            message: 'Invalid components'
        };
    }

    if (!(drink.hasOwnProperty('isActive'))||
        !(typeof (drink.isActive) === 'boolean')) {

        return {
            isError: true,
            message: 'Invalid isActive'
        };
    }

    return {
        isError: false
    };
};

var GetValidDrinks = function () {
    var validDrinks = [];
    for (var i = 0; i < Drinks.length; i++) {
        var drink = Drinks[i];
        var drinkValidation = ValidateDrink(drink);

        if (drinkValidation.isError) {

            console.log('Drink Error:');
            console.log('Description: ' + drinkValidation.message);
            console.log('Drink JSON index: ' + i.toString());
            console.log();
            continue;
        }

        validDrinks.push(drink);
    }

    validDrinks = RemoveDuplicateDrinks(validDrinks);

    return validDrinks;
};

module.exports.Mixers = GetValidMixers();
module.exports.Pumps = GetValidPumps();
module.exports.Drinks = GetValidDrinks();
