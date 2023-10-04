"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
//json-server --watch --port 8000 timesheet.json
var Api = /** @class */ (function () {
    function Api() {
        var _this = this;
        this.init = function () {
            _this.client = axios_1.default.create({
                baseURL: _this.timesheet_api,
                timeout: 5000
            });
            return _this.client;
        };
        this.getTimesheetCodes = function () {
            return _this.init().get("/combo");
        };
        this.getCardsUsingDate = function (timesheetDate) {
            return _this.init().get("/timesheet/" + timesheetDate);
        };
        this.postSaveTimesheet = function (saveData) {
            return _this.init().post("/timesheet", saveData);
        };
        this.deleteCardsUsingDate = function (timesheetDate) {
            return _this.init().delete("/timesheet/" + timesheetDate);
        };
        this.timesheet_api = "http://localhost:8000";
    }
    return Api;
}());
exports.default = Api;
//# sourceMappingURL=api.js.map