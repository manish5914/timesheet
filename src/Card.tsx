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

interface CardProps {
    card: CardDetails[], 
    timesheetCodes: TimeSheetCodes[], 
    UpDateTimeCode: Function, 
    UpdateCardTime: Function, 
    DeleteCard: Function
}

const Card = (cardProps: CardProps): React.ReactElement =>
{
    const [cards, setCards]= useState<CardDetails[]>(cardProps.card);
    const [timeCodes] = useState<TimeSheetCodes[]>(cardProps.timesheetCodes);
    const updateTimeCode: Function = cardProps.UpDateTimeCode;
    const UpdateCardTime: Function = cardProps.UpdateCardTime;
    const DeleteCard: Function = cardProps.DeleteCard;
    const [cardHours, setHours] = useState<number>(0);

    const handleSelect = (e: string, cardId: string) => {
        updateTimeCode(cardId, parseInt(e));
    }
    const setStartTime = (cardId: string, timeValue: string) => {
        Log("setStartTime", timeValue);
        UpdateCardTime(cardId, timeValue ? timeValue : DEFAULT_TIME, "start");
        //UpdateHours();
    }
    const setEndTime = (cardId: string, timeValue: string) => {
        Log("setEndTime", timeValue);
        UpdateCardTime(cardId,  timeValue ? timeValue : DEFAULT_TIME, "end");
       //UpdateCardTime ();
    }
    // const UpdateHours = (): void => {
    //     setHours(() => {
    //         return card.startTime && card.endTime ? CalculateHours(card.startTime, card.endTime) : Hours.ZeroHour;
    //     });
    // }
    const Remove = (cardId:string) =>{
        setCards((cards) => cards.filter((card) => card.id !== cardId));
        DeleteCard(cardId);
    }
    useEffect(() => {}, [cards, cardHours]);
    return (
        <div className='Cards'>
            { (cards) ? cards.map((card, index) => (
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
                                    <TimePicker onChange={(timeValue:string) => setStartTime(card.id, timeValue)} value = {card.startTime ? card.startTime : DEFAULT_TIME} format = {DEFAULT_TIME_FORMAT}/>
                                </div>
                                <div className="endTime">
                                    <TimePicker onChange = {(timeValue:string) => setEndTime(card.id, timeValue)} value = {card.endTime ? card.endTime : DEFAULT_TIME} format = {DEFAULT_TIME_FORMAT}/>
                                </div>
                                    
                                {
                                    timeCodes ? (
                                        <DropdownButton title="Select a Combo" onSelect={(index:string)=> {handleSelect(index, card.id)}} key = {index}> 
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
                                <button className="btn btn-primary remove" onClick={() => Remove(card.id)}>Remove</button>            
                            </div>
                        </div>
                    </div>
            )) : <div>No Card</div>}
        </div>
    );
}

export default Card;