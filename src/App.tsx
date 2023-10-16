import * as React from 'react';
import {useEffect, useState, useReducer} from 'react';
import './css/App.css';
import CardDetails, { CreateCard } from './cardDetails';
import TimeSheetCodes from './timeSheetCode';
import Card from './Card';
import Api from './api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AxiosResponse, AxiosError} from "axios";
import { DEFAULT_TIME , DEFAULT_TIMESHEET_CODE, Log, ProcessDate} from "./Utility";

//experimental
interface Action{
    type: string;
    payload?: CardDetails[];
    cardIdToRemove?: string;
}
enum ActionTypes {
    SET = 'SET',
    REMOVE_ITEM = 'REMOVE_ITEM'
}
const cardReducer = (state: CardDetails[], action: Action) => {
    switch(action.type){
        case 'SET':
            return action.payload;
        case 'REMOVE_ITEM':
            if(action.cardIdToRemove){
                return state.filter((item:CardDetails) => item.id !== action.cardIdToRemove);
            }
        default:
            throw new Error();
    }
}

const App = (): React.ReactElement => { 
    const [cards, setCards] = useReducer(cardReducer, []);
    const [timesheetCode, setTimesheetCode] = useState<TimeSheetCodes[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [logMessage, setLogMessage] = useState<string>("Hi");

    const api = new Api();
    //api
    const GetTimesheetCode = () => {
        api.getTimesheetCodes()
        .then((response:AxiosResponse) => (
            setTimesheetCode(response.data)
        ));
    }
    const PostSaveTimeSheet = async(saveData: CardDetails[], date: string) => {
        var timesheetData = {id: date, saveData};
        api.postSaveTimesheet(timesheetData)
        .then((response:AxiosResponse) => {
            Log("Data saved","", setLogMessage);
        })
        .catch((error:AxiosError)=> Log("failed", error, setLogMessage));
    }
    const GetCardsUsingDate = async(timesheetDateId: Date) => {
        setCards({type: ActionTypes.SET, payload: []});
        api.getCardsUsingDate(ProcessDate(timesheetDateId))
        .then((response:AxiosResponse) => {
            Log("Got Cards", response.data, setLogMessage);
            let newArr: CardDetails[] = [];
            response.data.saveData.map((card:CardDetails) => newArr.push(CreateCard(card.startTime, card.endTime, card.combo, card.payCode, card.projectCode, card.id)));
            setCards({
                type: ActionTypes.SET,
                payload: newArr
            });
        })
        .catch((error:AxiosError) => {
            if(error.code && error.code === AxiosError.ERR_BAD_REQUEST)
                Log("got Error in GetCardsUsingDate", error, setLogMessage)
            setCards({type: ActionTypes.SET, payload: []});
        })
    }
    const DeleteCardsUsingDate = async(timesheetDateId: Date) => {
        api.deleteCardsUsingDate(ProcessDate(timesheetDateId))
        .then((response:AxiosResponse) => {Log("Deleted", response, setLogMessage)})
        .catch((error:AxiosError) => {
            if(error.code && error.code === AxiosError.ERR_BAD_REQUEST)
                Log("failed", error, setLogMessage)
        })
    }

    //functions

    const UpdateCardTime = (cardUUID: string, timeValue: string, type: string): void =>{
        let newArr: CardDetails[] = cards? [...cards] : [];
        let cardIndex = newArr.findIndex(x => x.id === cardUUID);
        if(newArr && newArr[cardIndex]){
            if(type === "start")
                newArr[cardIndex].startTime = timeValue;
            if(type === "end")
                newArr[cardIndex].endTime = timeValue;
        }

        setCards({
            type: ActionTypes.SET,
            payload: newArr
        });
    }
    const UpdateTimeCode = (cardUUID: string, timeSheetIndex: number): void => {
        let newArr: CardDetails[] = cards? [...cards] : [];
        let cardIndex = newArr.findIndex(x => x.id === cardUUID);
        if(newArr && newArr[cardIndex]){
            newArr[cardIndex].combo = timesheetCode[timeSheetIndex].id;
            newArr[cardIndex].projectCode = timesheetCode[timeSheetIndex].projectCode;
            newArr[cardIndex].payCode = timesheetCode[timeSheetIndex].payCode;
        }
        setCards({
            type: ActionTypes.SET,
            payload: newArr
        });
    }
    
    const AddCard = (startTime: string, endTime: string, timeDetails?: TimeSheetCodes): CardDetails  => {
        if(timeDetails)
            return CreateCard(startTime, endTime, timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
        else
            return CreateCard(DEFAULT_TIME, DEFAULT_TIME, "null", DEFAULT_TIMESHEET_CODE,  DEFAULT_TIMESHEET_CODE);
    };
    const ClockIn = (): void => {
        var currentTime = new Date().toLocaleTimeString().substring(0, 8);
        let newArr: CardDetails[] = cards? [...cards] : [];
        let lastItemIndex = newArr.length - 1;
        if(newArr[lastItemIndex]){
            if(newArr[lastItemIndex].startTime === "start" ){
                newArr[lastItemIndex].startTime = currentTime
            }
            else if(newArr[lastItemIndex].endTime === DEFAULT_TIME){
                newArr[lastItemIndex].endTime = currentTime;
            }
            else{
                newArr.push(AddCard(currentTime, DEFAULT_TIME, timesheetCode.find(x => x.id === DEFAULT_TIMESHEET_CODE)));
            }
        }
        else{
            newArr.push(AddCard(currentTime, DEFAULT_TIME, timesheetCode.find(x => x.id === DEFAULT_TIMESHEET_CODE)));
        }
        setCards({
            type: ActionTypes.SET,
            payload: newArr
        });
    }
    const Save = (): void => {
        if(!cards){

            return;
        }
        let lastCard = cards[cards.length -1]
        if(lastCard == null){
            Log("list of cards empty", "", setLogMessage);
            return; 
        }
        if(lastCard && lastCard.endTime === "00:00:00"){
            Log("timesheet not Complete", "", setLogMessage);
            return; 
        }
        api.getCardsUsingDate(ProcessDate(currentDate))
        .then(() => {
            api.deleteCardsUsingDate(ProcessDate(currentDate))
            .then(() => {
                PostSaveTimeSheet(cards, ProcessDate(currentDate));
            })
            .catch((error: AxiosError) => {Log("could save as delete error", error.message, setLogMessage)});
        })
        .catch(() => {
            PostSaveTimeSheet(cards, ProcessDate(currentDate));
        });
    }
    const DeleteAll = (date: Date): void => {
        DeleteCardsUsingDate(date);
        setCards({
            type: ActionTypes.SET,
            payload: []
        });
    }
    const DeleteCard = (cardId: string): void => {
        setCards({
            type: 'REMOVE_ITEM',
            cardIdToRemove: cardId
        });
    
        Log("Delete Card", cardId);
    }

    useEffect(() => {GetTimesheetCode()}, []);
    useEffect(() => {GetCardsUsingDate(currentDate)}, [currentDate]);
    useEffect(() => {Log("useEffect", cards)}, [cards])
    return (
        <div className="App">
            <h1 className="h1">TimeSheet</h1>
            <h2 className="h2">{logMessage}</h2>
            <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary bg-dark" data-bs-theme="dark">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className = "btn btn-primary navbtn" onClick={() => (ClockIn())}>Clock In</button>
                        </li>
                        <li className="nav-item">
                            <button className = "btn btn-primary navbtn" onClick={() => (Save())}>Save</button>
                        </li>
                        <li className="nav-item">
                            <button className = "btn btn-primary navbtn" onClick={() => (DeleteAll(currentDate))}>Delete All</button>
                        </li>
                        <li>
                            <DatePicker className="datePicker" selected={currentDate} onChange={(date: Date) => {setCurrentDate(date)}}/>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
            <div>
                {
                    (cards && cards.length > 0) ? (
                        <div>
                            <Card card = {cards} timesheetCodes = {timesheetCode} UpDateTimeCode = {UpdateTimeCode} UpdateCardTime = {UpdateCardTime} DeleteCard ={DeleteCard}/> 
                        </div>
                    ): <p>Add Card</p>          
                }
            </div>
        </div>
    );
}

export default App;

