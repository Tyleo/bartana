
var RunPumpFor = function (pin, durationInSeconds, completionCallback) {
    // TODO: Begin Pump
    setTimeout(
        function () {
            // TODO: End Pump
            if (completionCallback) {
                completionCallback();
            }
        },
        durationInSeconds * 1000
    );
};

var ProcessPumpInfos = function (pumpInfos, completionCallback) {
    var numPumpInfos = pumpInfos.length;
    var thisCompletionCallback = function () {
        numPumpInfos--;
        if (numPumpInfos === 0 && completionCallback) {
            completionCallback();
        }
    };

    for (var i = 0; i < pumpInfos.length; i++) {
        var pumpInfo = pumpInfos[i];
        RunPumpFor(pumpInfo.pin,
                   pumpInfo.durationInSeconds,
                   thisCompletionCallback);
    }
};

var RunPumps = function (fillAmount, mixInfoArray, completionCallback) {
    var pumpInfos = [];

    for (var i = 0; i < mixInfoArray.length; i++) {
        var mixInfo = mixInfoArray[i];
        var pumps = mixInfo.pumps;
        var mixAmount = mixInfo.amount;

        var mixAmountMl = mixAmount * fillAmount;

        var mixFlowRate = 0;
        for (var j = 0; j < pumps.length; j++) {
            var pump = pumps[j];
            mixFlowRate += pump.flowRate;
        }

        var mixFlowTime = mixAmountMl / mixFlowRate;

        for (var j = 0; j < pumps.length; j++) {
            var pump = pumps[j];
            var durationInSeconds = mixFlowTime * pump.flowRate / mixFlowRate;

            var pumpInfo = {
                pin: pump.pin,
                durationInSeconds: durationInSeconds
            };
            pumpInfos.push(pumpInfo);
        }
    }

    ProcessPumpInfos(pumpInfos, completionCallback);
};

module.exports = RunPumps;
