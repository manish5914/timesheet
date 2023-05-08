import React from "react";
import {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'


const Card = ({currentCard}) =>
{
    const [card, setCard]= useState(currentCard[0]);
    const [timeCodes, setTimeCodes] = useState(currentCard[1]);
    const updateCards = currentCard[2];
    const handleSelect = (e) => {
        updateCards(card.index, e);
    }
    return (
        <div className="Card">
            <div>
                <p>{currentCard[0].startTime ? currentCard[0].startTime : "StartTime"}</p>
            </div>
            <div>
                <p>{currentCard[0].endTime ? currentCard[0].endTime : "EndTime"}</p>
            </div>
            <div>
                <p>{currentCard[0].id ? currentCard[0].id: "No Combo Selected"}</p>
            </div>
            <div>
                <p>{currentCard[0].payCode ? currentCard[0].payCode: "No PayCode Selected"}</p>
            </div>
            <div>
                <p>{currentCard[0].projectCode ? currentCard[0].projectCode : "No Project Code Selected"}</p>
            </div>
                   {timeCodes ?  (<DropdownButton title="Select a Combo" onSelect={handleSelect}> {timeCodes.map((timecode, index) => <Dropdown.Item eventKey={index}>{timecode.id}</Dropdown.Item>)} </DropdownButton>):  <div><p>No Combo</p></div>}               
        </div>
    )
}

export default Card;