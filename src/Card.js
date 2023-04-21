import React from "react";
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'


const Card = ({currentCard}) =>
{
    const [timeCodes, setTimeCodes] = useState([
        {combo: "Meal", projectCode: "nonproject", payCode: "MeetingPlannign"},
        {combo: "PBI", projectCode: "featuredev", payCode: "product"},
        {combo: "Bug", projectCode: "maintenance", payCode: "MeetingPlannign"},
        {combo: "Scrum", projectCode: "featuredev", payCode: "MeetingPlannign"},
        {combo: "Grooming", projectCode: "featuredev", payCode: "product"},
        {combo: "Team Meeting", projectCode: "dfoperations", payCode: "MeetingPlannign"},
    ])
    const handleSelect = (e) => {
        UpdateCard(e);
    }
    function UpdateCard(i){
        currentCard.projectCode = timeCodes[i].projectCode;
        currentCard.payCode = timeCodes[i].payCode;
    }
    return (
        <div className="Card">
            <div>
                <p>{currentCard.startTime ? currentCard.startTime : "StartTime"}</p>
            </div>
            <div>
                <p>{currentCard.endTime ? currentCard.endTime : "EndTime"}</p>
            </div>
            <div>
                <p>{currentCard.payCode ? currentCard.payCode: "No PayCode Selected"}</p>
            </div>
            <div>
                <p>{currentCard.projectCode ? currentCard.projectCode : "No Project Code Selected"}</p>
            </div>
                   {timeCodes ?  (<DropdownButton title="Select a Combo" onSelect={handleSelect}> {timeCodes.map((timecode, index) => <Dropdown.Item eventKey={index}>{timecode.combo}</Dropdown.Item>)} </DropdownButton>):  <div><p>No Combo</p></div>}               
        </div>
    )
}

export default Card;