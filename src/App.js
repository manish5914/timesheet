"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("react");
require("./App.css");
var cardDetails_1 = require("./cardDetails");
var Card_1 = require("./Card");
var api_1 = require("./api");
var react_datepicker_1 = require("react-datepicker");
require("react-datepicker/dist/react-datepicker.css");
var App = function () {
    var _a = (0, react_2.useState)([]), cards = _a[0], setCards = _a[1];
    var _b = (0, react_2.useState)([]), timesheetCode = _b[0], setTimesheetCode = _b[1];
    var _c = (0, react_2.useState)(new Date()), currentDate = _c[0], setCurrentDate = _c[1];
    var _d = (0, react_2.useState)("Hi"), logMessage = _d[0], setLogMessage = _d[1];
    var api = new api_1.default();
    //api
    var GetTimesheetCode = function () {
        api.getTimesheetCodes()
            .then(function (response) { return (setTimesheetCode(response.data)); });
    };
    var PostSaveTimeSheet = function (saveData, date) { return __awaiter(void 0, void 0, void 0, function () {
        var timesheetData;
        return __generator(this, function (_a) {
            timesheetData = { id: date, saveData: saveData };
            api.postSaveTimesheet(timesheetData)
                .then(function (response) { return logger("Data saved", response); })
                .catch(function (error) { return logger("failed", error.response.data); });
            return [2 /*return*/];
        });
    }); };
    var GetCardsUsingDate = function (timesheetDateId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            api.getCardsUsingDate(processDate(timesheetDateId))
                .then(function (response) {
                logger("Got Cards", response.data);
                setCards(response.data.saveData);
                //todo: data not updating in cards 
            })
                .catch(function (error) {
                if (error.response.data.lenght == 0) {
                    logger("No Data for this date", error.response);
                }
                else {
                    logger("No data received for this date", error.response);
                }
                setCards([]);
            });
            return [2 /*return*/];
        });
    }); };
    var DeleteCardsUsingDate = function (timesheetDateId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            api.deleteCardsUsingDate(processDate(timesheetDateId))
                .then(function (response) { logger("Deleted", response); })
                .catch(function (error) { logger("failed", error.response.data); });
            return [2 /*return*/];
        });
    }); };
    //functions
    function processDate(date) {
        return date.toISOString().substring(0, 10);
    }
    var updateCardTime = function (card, timeValue, type) {
        setCards(function (cardValue) {
            var newArr = __spreadArray([], cardValue, true);
            var cardIndex = newArr.findIndex(function (x) { return x.id === card.id; });
            if (newArr[cardIndex]) {
                if (type === "start")
                    newArr[cardIndex].startTime = timeValue;
                if (type === "end")
                    newArr[cardIndex].endTime = timeValue;
            }
            return newArr;
        });
    };
    var updateTimeCode = function (card, timeSheetIndex) {
        setCards(function (cardValue) {
            var newArr = __spreadArray([], cardValue, true);
            var cardIndex = newArr.findIndex(function (x) { return x.id === card.id; });
            if (newArr[cardIndex]) {
                newArr[cardIndex].combo = timesheetCode[timeSheetIndex].id;
                newArr[cardIndex].projectCode = timesheetCode[timeSheetIndex].projectCode;
                newArr[cardIndex].payCode = timesheetCode[timeSheetIndex].payCode;
            }
            return newArr;
        });
    };
    function AddCard(startTime, endTime, timeDetails) {
        return (0, cardDetails_1.default)(startTime, endTime, timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
    }
    ;
    function ClockIn() {
        setCards(function (cardValue) {
            var currentTime = new Date().toLocaleTimeString().substring(0, 8);
            var newArr = __spreadArray([], cardValue, true);
            var lastItemIndex = newArr.length - 1;
            if (newArr[lastItemIndex]) {
                if (newArr[lastItemIndex].startTime === "start") {
                    newArr[lastItemIndex].startTime = currentTime;
                }
                else if (newArr[lastItemIndex].endTime === "00:00:00") {
                    newArr[lastItemIndex].endTime = currentTime;
                }
                else {
                    newArr.push(AddCard(currentTime, "00:00:00", timesheetCode.find(function (x) { return x.id === "Work"; })));
                }
            }
            else {
                newArr.push(AddCard(currentTime, "00:00:00", timesheetCode.find(function (x) { return x.id === "Work"; })));
            }
            return newArr;
        });
    }
    function Save() {
        var lastCard = cards[cards.length - 1];
        if (lastCard == null) {
            logger("list of cards empty", "");
            return;
        }
        if (lastCard.endTime === "00:00:00") {
            logger("timesheet not Complete", "");
            return;
        }
        api.getCardsUsingDate(processDate(currentDate))
            .then(function () {
            api.deleteCardsUsingDate(processDate(currentDate))
                .then(function () {
                PostSaveTimeSheet(cards, processDate(currentDate));
            })
                .catch(function (error) { logger("could save as delete error", error.message); });
        })
            .catch(function () {
            PostSaveTimeSheet(cards, processDate(currentDate));
        });
    }
    function DeleteAll(date) {
        DeleteCardsUsingDate(date);
        setCards([]);
    }
    function logger(type, data) {
        console.log(type, data);
        setLogMessage(type);
    }
    (0, react_2.useEffect)(function () { GetTimesheetCode(); }, []);
    (0, react_2.useEffect)(function () { GetCardsUsingDate(currentDate); }, [currentDate]);
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement("h1", null, "TimeSheet"),
        react_1.default.createElement("h2", { className: 'Messages' }, logMessage),
        react_1.default.createElement("button", { onClick: function () { return (ClockIn()); } }, "Clock In"),
        react_1.default.createElement("button", { onClick: function () { return (Save()); } }, "Save"),
        react_1.default.createElement("button", { onClick: function () { return (DeleteAll(currentDate)); } }, "Delete"),
        react_1.default.createElement(react_datepicker_1.default, { selected: currentDate, onChange: function (date) { setCurrentDate(date); } }),
        react_1.default.createElement("div", { className: 'Cards' }, (cards && cards.length > 0) ? (cards.map(function (card) { return (react_1.default.createElement("div", { className: 'card' },
            react_1.default.createElement(Card_1.default, { currentCard: [card, timesheetCode, updateTimeCode, updateCardTime] }))); })) : react_1.default.createElement("p", null, "Add Card"))));
};
exports.default = App;
//# sourceMappingURL=App.js.map