import React from "react";
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'

const Card = ({currentCard}) =>
{
    const [card, setCard]= useState(currentCard[0]);
    const [timeCodes, setTimeCodes] = useState(currentCard[1]);
    const updateTimeCode = currentCard[2];
    const updateCardTime = currentCard[3];
    const handleSelect = (e) => {
        updateTimeCode(card.id, parseInt(e));
    }
    const setTime = (timeValue, type) => {
        console.log("df", timeValue, type);
        updateCardTime(card.id, timeValue, "start");
    }
    useEffect(() => {}, [card]);
    return (
        <div className="Card">
            <div>
                <p>{card.startTime ? card.startTime : "StartTime"}</p>
            </div>
            <div>
                <TimePicker onChange={setTime} value = {card.startTime ? card.startTime : "00:00:00"} format = "HH:mm:ss"/>
            </div>
            <div>
                <TimePicker onChange = {setTime} value = {card.endTime ? card.endTime : "00:00:00"} format = "HH:mm:ss"/>
            </div>

            <div>
                <p>{card.combo ? card.combo: "No Combo Selected"}</p>
            </div>
            <div>
                <p>{card.payCode ? card.payCode: "No PayCode Selected"}</p>
            </div>
            <div>
                <p>{card.projectCode ? card.projectCode : "No Project Code Selected"}</p>
            </div>
                   {timeCodes ?  (<DropdownButton title="Select a Combo" onSelect={handleSelect}> {timeCodes.map((timecode, index) => <Dropdown.Item eventKey={index}>{timecode.id}</Dropdown.Item>)} </DropdownButton>):  <div><p>No Combo</p></div>}               
        </div>
    )
}

export default Card;