"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
require("bootstrap/dist/css/bootstrap.min.css");
var DropdownButton_1 = require("react-bootstrap/DropdownButton");
var Dropdown_1 = require("react-bootstrap/Dropdown");
var react_time_picker_1 = require("react-time-picker");
require("react-time-picker/dist/TimePicker.css");
require("react-clock/dist/Clock.css");
var Card = function (_a) {
    var currentCard = _a.currentCard;
    var _b = (0, react_1.useState)(currentCard[0]), card = _b[0], setCard = _b[1];
    var _c = (0, react_1.useState)(currentCard[1]), timeCodes = _c[0], setTimeCodes = _c[1];
    var updateTimeCode = currentCard[2];
    var updateCardTime = currentCard[3];
    var handleSelect = function (e) {
        updateTimeCode(card.id, parseInt(e));
    };
    var setStartTime = function (timeValue) {
        console.log("df", timeValue);
        updateCardTime(card.id, timeValue ? timeValue : "00:00:00", "start");
    };
    var setEndTime = function (timeValue) {
        console.log("df", timeValue);
        updateCardTime(card.id, timeValue ? timeValue : "00:00:00", "end");
    };
    (0, react_1.useEffect)(function () { }, [card]);
    return (React.createElement("div", { className: "Card" },
        React.createElement("div", null,
            React.createElement("p", null, card.startTime ? card.startTime : "StartTime")),
        React.createElement("div", null,
            React.createElement(react_time_picker_1.default, { onChange: setStartTime, value: card.startTime ? card.startTime : "00:00:00", format: "HH:mm:ss" })),
        React.createElement("div", null,
            React.createElement(react_time_picker_1.default, { onChange: setEndTime, value: card.endTime ? card.endTime : "00:00:00", format: "HH:mm:ss" })),
        React.createElement("div", null,
            React.createElement("p", null, card.combo ? card.combo : "No Combo Selected")),
        React.createElement("div", null,
            React.createElement("p", null, card.payCode ? card.payCode : "No PayCode Selected")),
        React.createElement("div", null,
            React.createElement("p", null, card.projectCode ? card.projectCode : "No Project Code Selected")),
        timeCodes ? (React.createElement(DropdownButton_1.default, { title: "Select a Combo", onSelect: handleSelect },
            " ",
            timeCodes.map(function (timecode, index) { return React.createElement(Dropdown_1.default.Item, { eventKey: index }, timecode.id); }),
            " ")) : React.createElement("div", null,
            React.createElement("p", null, "No Combo"))));
};
exports.default = Card;
//# sourceMappingURL=Card.js.map