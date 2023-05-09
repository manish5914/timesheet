import React from "react";
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

const Card = ({currentCard}) =>
{
    const [card, setCard]= useState(currentCard[0]);
    const [timeCodes, setTimeCodes] = useState(currentCard[1]);
    const updateCards = currentCard[2];
    const handleSelect = (e) => {
        updateCards(card.id, parseInt(e));
    }
    useEffect(() => {}, [card]);
    return (
        <div className="Card">
            <div>
                <p>{card.startTime ? card.startTime : "StartTime"}</p>
            </div>
            <div>
                <p>{card.endTime ? card.endTime : "EndTime"}</p>
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