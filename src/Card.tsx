import * as React from "react";
import {useState, useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dropdown, DropdownButton} from "react-bootstrap"
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css'
import 'react-clock/dist/Clock.css'
import TimeSheetCodes from "./timeSheetCode";
import CardDetails from "./cardDetails";
import {CalculateHours, DEFAULT_TIME, DEFAULT_TIME_FORMAT, Hours, Log} from "./Utility"
import "./css/Card.css"

const Card = ({currentCard}:any): React.ReactElement =>
{
    const [card]= useState<CardDetails>(currentCard[0]);
    const [timeCodes] = useState<TimeSheetCodes[]>(currentCard[1]);
    const updateTimeCode: Function = currentCard[2];
    const UpdateCardTime: Function = currentCard[3];
    const DeleteCard: Function = currentCard[4];
    const [cardHours, setHours] = useState<number>(0);

    const handleSelect = (e: string) => {
        updateTimeCode(card.id, parseInt(e));
    }
    const setStartTime = (timeValue: string) => {
        Log("setStartTime", timeValue);
        UpdateCardTime(card.id, timeValue ? timeValue : DEFAULT_TIME, "start");
        UpdateHours();
    }
    const setEndTime = (timeValue: string) => {
        Log("setEndTime", timeValue);
        UpdateCardTime(card.id,  timeValue ? timeValue : DEFAULT_TIME, "end");
        UpdateCardTime ();
    }
    const UpdateHours = (): void => {
        setHours(() => {
            return card.startTime && card.endTime ? CalculateHours(card.startTime, card.endTime) : Hours.ZeroHour;
        });
    }
    const Remove = () =>{
        DeleteCard(card.id);
    }
    useEffect(() => {}, [card, cardHours]);
    return (
        <div className="card other" data-bs-theme="dark">
            <div className="card-body" key = {card.id}>
                <h5 className ="card-title">
                    {card.combo ? card.combo: "No Combo Selected"}
                </h5>
                <h6 className ="card-subtitle">
                    {card.payCode ? card.payCode: "No PayCode Selected"}
                </h6>
                <p className="card-text">
                    {card.projectCode ? card.projectCode : "No Project Code Selected"}
                </p>
                <p className = "card-text">
                    {card.id ? card.id: "no Id"}
                </p>
                <div className="actions">
                    <div className="startTime">
                        <TimePicker onChange={setStartTime} value = {card.startTime ? card.startTime : DEFAULT_TIME} format = {DEFAULT_TIME_FORMAT}/>
                    </div>
                    <div className="endTime">
                        <TimePicker onChange = {setEndTime} value = {card.endTime ? card.endTime : DEFAULT_TIME} format = {DEFAULT_TIME_FORMAT}/>
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
                    <button className="btn btn-primary remove" onClick={() => Remove()}>Remove</button>            
                </div>
            </div>
        </div>
    )
}

export default Card;