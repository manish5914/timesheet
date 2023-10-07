import * as React from "react";
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dropdown, DropdownButton} from "react-bootstrap"
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import TimeSheetCodes from "./timeSheetCode";
import CardDetails from "./cardDetails";
import {Log} from "./Utility"

const Card = ({currentCard}:any): React.ReactElement =>
{
    const [card]= useState<CardDetails>(currentCard[0]);
    const [timeCodes] = useState<TimeSheetCodes[]>(currentCard[1]);
    const updateTimeCode: Function = currentCard[2];
    const updateCardTime: Function = currentCard[3];
    const handleSelect = (e: string) => {
        updateTimeCode(card.id, parseInt(e));
    }
    const setStartTime = (timeValue: string) => {
        Log("setStartTime", timeValue);
        updateCardTime(card.id, timeValue ? timeValue : "00:00:00", "start");
    }
    const setEndTime = (timeValue: string) => {
        Log("setEndTime", timeValue);
        updateCardTime(card.id,  timeValue ? timeValue : "00:00:00", "end");
    }
    useEffect(() => {}, [card]);
    return (
        <div className="Card" key = {card.id}>
            <div>
                <p>{card.startTime ? card.startTime : "StartTime"}</p>
            </div>
            <div>
                <TimePicker onChange={setStartTime} value = {card.startTime ? card.startTime : "00:00:00"} format = "HH:mm:ss"/>
            </div>
            <div>
                <TimePicker onChange = {setEndTime} value = {card.endTime ? card.endTime : "00:00:00"} format = "HH:mm:ss"/>
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
                   
            {
                timeCodes ? (
                    <DropdownButton title="Select a Combo" onSelect={handleSelect}> 
                        {timeCodes.map((timecode: TimeSheetCodes, index: number) => 
                            <Dropdown.Item eventKey={index} key={index}>
                                {timecode.id}
                            </Dropdown.Item>)} 
                    </DropdownButton>
                )
                :<div>
                    <p>No Combo</p>
                </div>
            }               
        </div>
    )
}

export default Card;