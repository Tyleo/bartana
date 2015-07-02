var Model = require('./model.js');
var Pins = require('../json/gpio.json');
var Sqlite = require('sqlite3');

var db = new Sqlite.Database('./private/data/bar.sqlite');

var DropBarTables = function () {
    db.parallelize(function () {
        db.run('DROP TABLE IF EXISTS Drinks');
        db.run('DROP TABLE IF EXISTS Mixers');
        db.run('DROP TABLE IF EXISTS Pumps');
        db.run('DROP TABLE IF EXISTS Components')
    });
};

var CreatePortsTable = function () {
    db.run('CREATE TABLE Ports(Bank INTEGER,                  ' +
           '                   Column INTEGER,                ' +
           '                   Row INTEGER,                   ' +
           '                   Pin STRING NOT NULL UNIQUE,    ' +
           '                                                  ' +
           '                   PRIMARY KEY (Bank,             ' +
           '                                Column,           ' +
           '                                Row))             ' );
};

var InsertPortRows = function () {
    db.parallelize(function () {
        var portInsert = db.prepare('INSERT INTO Ports   ' +
                                    'VALUES (?, ?, ?, ?) ');

        for (var pinProperty in Pins) {
            if (!Pins.hasOwnProperty(pinProperty)) {
                continue;
            }

            var bank = Pins[pinProperty];
            var bankNum = parseInt(pinProperty);

            for (var bankProperty in bank) {
                
                if (!bank.hasOwnProperty(bankProperty)) {
                    continue;
                }

                var column = bank[bankProperty];
                var columnNum = parseInt(bankProperty);

                for (var columnProperty in column) {
                    if (!column.hasOwnProperty(columnProperty)) {
                        continue;
                    }

                    var pin = column[columnProperty];
                    var rowNum = parseInt(columnProperty);

                    portInsert.run(bankNum,
                                   columnNum,
                                   rowNum,
                                   pin);
                }
            }
        }
    });
};

var CreatePortsTableAndInsertRowsIfNeeded = function () {
    db.get('SELECT name          ' +
           'FROM sqlite_master   ' +
           'WHERE type = "table" ' +
           'AND name = "Ports"   ',
           function (err, row) {
               if (row !== undefined) {
                   return;
               }

               db.serialize(function () {
                   CreatePortsTable();
                   InsertPortRows();
               });
    });
};

var CreateDrinksTable = function () {
    db.run('CREATE TABLE Drinks(Name STRING,               ' +
           '                    IsActive INTEGER NOT NULL, ' +
           '                                               ' +
           '                    PRIMARY KEY (Name))        ' );
};

var InsertDrinkRows = function () {
    db.parallelize(function () {
        var drinkInsert = db.prepare('INSERT INTO Drinks ' +
                                     'VALUES (?, ?)      ');

        for (var i = 0; i < Model.Drinks.length; i++) {
            var drink = Model.Drinks[i];
            drinkInsert.run(drink.name, (drink.isActive ? 1 : 0));
        }
    });
};

var CreateDrinksTableAndInsertRows = function () {
    db.serialize(function () {
        CreateDrinksTable();
        InsertDrinkRows();
    });
};

var CreateMixersTable = function () {
    db.run('CREATE TABLE Mixers(Name STRING,                     ' +
           '                    PercentAlcohol INTEGER NOT NULL, ' +
           '                    Color STRING NOT NULL,           ' +
           '                    IsCarbonated INTEGER NOT NULL,   ' +
           '                    IsActive INTEGER NOT NULL,       ' +
           '                                                     ' +
           '                    PRIMARY KEY (Name))              ' );
};

var InsertMixerRows = function () {
    db.parallelize(function () {
        var mixerInsert = db.prepare('INSERT INTO Mixers     ' +
                                     'VALUES (?, ?, ?, ?, ?) ' );

        for (var i = 0; i < Model.Mixers.length; i++) {
            var mixer = Model.Mixers[i];
            mixerInsert.run(mixer.name,
                            mixer.percentAlcohol,
                            mixer.color,
                            mixer.isCarbonated ? 1 : 0,
                            mixer.isActive ? 1 : 0);
        }
    });
};

var CreateMixersTableAndInsertRows = function () {
    db.serialize(function () {
        CreateMixersTable();
        InsertMixerRows();
    });
};

var CreatePumpsTable = function () {
    db.run('CREATE TABLE Pumps(PinBank INTEGER,            ' +
           '                   PinColumn INTEGER,          ' +
           '                   PinRow INTEGER,             ' +
           '                   Mixer STRING NOT NULL,      ' +
           '                   FlowRate REAL NOT NULL,     ' +
           '                   IsActive INTEGER NOT NULL,  ' +
           '                                               ' +
           '                   PRIMARY KEY (PinBank,       ' +
           '                                PinColumn,     ' +
           '                                PinRow),       ' +
           '                                               ' +
           '                   FOREIGN KEY (PinBank,       ' +
           '                                PinColumn,     ' +
           '                                PinRow)        ' +
           '                   REFERENCES Ports(PinBank,   ' +
           '                                    PinColumn, ' +
           '                                    PinRow),   ' +
           '                                               ' +
           '                   FOREIGN KEY (Mixer)         ' +
           '                   REFERENCES Mixers(Name))    ' );
};

var InsertPumpRows = function () {
    db.parallelize(function () {
        var pumpInsert = db.prepare('INSERT INTO Pumps      ' +
                                    'VALUES (?, ?, ?, ?, ?, ?) ');

        for (var i = 0; i < Model.Pumps.length; i++) {
            var pump = Model.Pumps[i];
            pumpInsert.run(pump.pin.bank,
                           pump.pin.column,
                           pump.pin.row,
                           pump.mixer,
                           pump.flowRate,
                           pump.isActive ? 1 : 0);
        }
    });
};

var CreatePumpsTableAndInsertRows = function () {
    db.serialize(function () {
        CreatePumpsTable();
        InsertPumpRows();
    });
};

var CreateComponentsTable = function () {
    db.run('CREATE TABLE Components(Drink STRING,            ' +
           '                        Mixer STRING,            ' +
           '                        Parts REAL,              ' +
           '                                                 ' +
           '                        FOREIGN KEY (Drink)      ' +
           '                        REFERENCES Drinks(Name)  ' +
           '                                                 ' +
           '                        FOREIGN KEY (Mixer)      ' +
           '                        REFERENCES Mixers(Name)) ' );
};

var InsertComponentRows = function () {
    db.parallelize(function () {
        var componentInsert = db.prepare('INSERT INTO Components ' +
                                         'VALUES (?, ?, ?)       ' );

        for (var i = 0; i < Model.Drinks.length; i++) {
            var drink = Model.Drinks[i];

            for (var j = 0; j < drink.components.length; j++) {
                var component = drink.components[j];
                componentInsert.run(drink.name,
                                    component.mixer,
                                    component.parts);
            }
        }
    });
};

var CreateComponentsTableAndInsertRows = function () {
    db.serialize(function () {
        CreateComponentsTable();
        InsertComponentRows();
    });
};

var CreateBarTables = function () {
    db.serialize(function () {
        db.parallelize(function () {
            CreateDrinksTableAndInsertRows();
            CreateMixersTableAndInsertRows();
        });
        
        db.parallelize(function () {
            CreatePumpsTableAndInsertRows();
            CreateComponentsTableAndInsertRows();
        });
    });
};

var GetClientDrinks = function (drinksResultCallback) {
    var drinks = {};

    db.each('SELECT Drinks.Name AS Drink,                       ' +
            '       Mixers.Name AS Mixer,                       ' +
            '       Mixers.PercentAlcohol,                      ' +
            '       Mixers.Color,                               ' +
            '       Mixers.IsCarbonated,                        ' +
            '       Components.Parts                            ' +
            'FROM Mixers                                        ' +
            'JOIN Components ON Mixers.Name == Components.Mixer ' +
            'JOIN Drinks ON Components.Drink == Drinks.Name     ' +
            'WHERE Drinks.IsActive == 1                         ' +
            'AND (SELECT COUNT(*)                               ' +
            '     FROM Mixers                                   ' +
            '     WHERE Mixers.Name == Drinks.Name) ==          ' +
            '    (SELECT COUNT(*)                               ' +
            '     FROM Mixers                                   ' +
            '     WHERE Mixers.Name == Drinks.Name              ' +
            '     AND Mixers.IsActive)                          ' +
            'AND (SELECT COUNT(*)                               ' +
            '     FROM Pumps                                    ' +
            '     WHERE Pumps.Mixer == Mixers.Name              ' +
            '     AND Pumps.IsActive == 1) > 0                  ',
            function (err, row) {
                var drink = row.Drink;
                var component = {
                    name: row.Mixer,
                    percentAlcohol: row.PercentAlcohol,
                    color: row.Color,
                    isCarbonated: row.IsCarbonated,
                    parts: row.Parts
                };
                if (!drinks.hasOwnProperty(drink)) {
                    drinks[drink] = [];
                }
                drinks[drink].push(component);
            },
            function (err) {
                drinksArray = [];
                for (var drink in drinks) {
                    if (drinks.hasOwnProperty(drink)) {
                        drinksArray.push({
                            name: drink,
                            components: drinks[drink]
                        });
                    }
                }
                if (drinksResultCallback) {
                    drinksResultCallback(drinksArray);
                }
            }
    );
};

var GetServerMixInfo = function (components, mixInfoCallback) {
    var mixInfo = {};
    var componentsStrings = [];
    var questionsString = '';

    for (var i = 0; i < components.length; i++) {
        var component = components[i];
        mixInfo[component.name] = {
            amount: component.amount,
            pumps: []
        };

        componentsStrings.push(component.name);
        questionsString += '?';
        if (i !== components.length - 1) {
            questionsString += ', ';
        }
    }

    db.each('SELECT Mixer, Pin, FlowRate             ' +
            'FROM Ports                              ' +
            'JOIN Pumps                              ' +
            'ON Ports.Bank == Pumps.PinBank          ' +
            'AND Ports.Column == Pumps.PinColumn     ' +
            'AND Ports.Row == Pumps.PinRow           ' +
            'WHERE Mixer IN (' + questionsString + ')',
            componentsStrings,
            function (err, row) {
                var mixer = row.Mixer;
                mixInfo[mixer].pumps.push(
                    {
                        pin: row.Pin,
                        flowRate: row.FlowRate
                    }
                );
            },
            function (err) {
                var mixInfoArray = [];
                for (var currentMixInfo in mixInfo) {
                    if (mixInfo.hasOwnProperty(currentMixInfo)) {
                        mixInfoArray.push(mixInfo[currentMixInfo]);
                    }
                }
                if (mixInfoCallback) {
                    mixInfoCallback(mixInfoArray);
                }
            }
    );

};

// Execute

db.serialize(function () {
    DropBarTables();
    CreatePortsTableAndInsertRowsIfNeeded();
    CreateBarTables();
});

module.exports.GetClientDrinks = GetClientDrinks;
module.exports.GetServerMixInfo = GetServerMixInfo;
