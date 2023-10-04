"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var CardDetails = function (startTime, endTime, combo, payCode, projectCode) { return ({
    id: (0, uuid_1.v4)(),
    startTime: startTime,
    endTime: endTime,
    combo: combo,
    payCode: payCode,
    projectCode: projectCode
}); };
exports.default = CardDetails;
//# sourceMappingURL=cardDetails.js.map