import * as React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import CardDetails, { CreateCard } from './cardDetails';
import TimeSheetCodes from './timeSheetCode';
import Card from './Card';
import Api from './api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AxiosResponse, AxiosError} from "axios";
import { DEFAULT_TIME , DEFAULT_TIMESHEET_CODE, Log, ProcessDate} from "./Utility";

const App = (): React.ReactElement => { 
    const [cards, setCards] = useState<CardDetails[]>([]);
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
        .then((response:AxiosResponse) => Log("Data saved","", setLogMessage))
        .catch((error:AxiosError)=> Log("failed", error, setLogMessage));
    }
    const GetCardsUsingDate = async(timesheetDateId: Date) => {
        setCards([]);
        api.getCardsUsingDate(ProcessDate(timesheetDateId))
        .then((response:AxiosResponse) => {
            Log("Got Cards", response.data, setLogMessage);
            setCards(() => {
                let newArr: CardDetails[] = [];
                response.data.saveData.map((card:CardDetails) => newArr.push(CreateCard(card.startTime, card.endTime, card.combo, card.payCode, card.projectCode, card.id)));
                return newArr;
            });
        })
        .catch((error:AxiosError) => {
            if(error.code && error.code === AxiosError.ERR_BAD_REQUEST)
                Log("got Error in GetCardsUsingDate", error, setLogMessage)
            setCards([]);
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
        setCards((cardValue) => {
            let newArr = [...cardValue];
            let cardIndex = newArr.findIndex(x => x.id === cardUUID);
            if(newArr[cardIndex]){
                if(type === "start")
                    newArr[cardIndex].startTime = timeValue;
                if(type === "end")
                    newArr[cardIndex].endTime = timeValue;
            }
            return newArr;
        });
    }
    const UpdateTimeCode = (cardUUID: string, timeSheetIndex: number): void => {
        setCards((cardValue) => {
            let newArr = [...cardValue];
            let cardIndex = newArr.findIndex(x => x.id === cardUUID);
            if(newArr[cardIndex]){
                newArr[cardIndex].combo = timesheetCode[timeSheetIndex].id;
                newArr[cardIndex].projectCode = timesheetCode[timeSheetIndex].projectCode;
                newArr[cardIndex].payCode = timesheetCode[timeSheetIndex].payCode;
            }
            return newArr;
        });
    }
    
    const AddCard = (startTime: string, endTime: string, timeDetails?: TimeSheetCodes): CardDetails  => {
        if(timeDetails)
            return CreateCard(startTime, endTime, timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
        else
            return CreateCard(DEFAULT_TIME, DEFAULT_TIME, "null", DEFAULT_TIMESHEET_CODE,  DEFAULT_TIMESHEET_CODE);
    };
    const ClockIn = (): void => {
        setCards((cardValue) => {
            var currentTime = new Date().toLocaleTimeString().substring(0, 8);
            let newArr = [...cardValue];
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
            return newArr;
        });
    }
    const Save = (): void => {
        let lastCard = cards[cards.length -1];
        if(lastCard == null){
            Log("list of cards empty", "", setLogMessage);
            return; 
        }
        if(lastCard.endTime === "00:00:00"){
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
        setCards([]);
    }
    const DeleteCard = (cardId: string): void => {
        //TODO: Card being removed properly in array, NOT updating in UI
        setCards((cardList) => {
            let newArr = [...cardList];
            return newArr.filter((card) => !(card.id === cardId));
        });
        Log("Delete Card", cardId);
    }
    useEffect(() => {GetTimesheetCode()}, []);
    useEffect(() => {GetCardsUsingDate(currentDate)}, [currentDate]);
    return (
        <div className="App">
            <h1>TimeSheet</h1>
            <h2 className='Messages'>{logMessage}</h2>
            <button onClick={() => (ClockIn())}>Clock In</button>
            <button onClick={() => (Save())}>Save</button>
            <button onClick={() => (DeleteAll(currentDate))}>Delete</button>
            <DatePicker selected={currentDate} onChange={(date: Date) => {setCurrentDate(date)}}/>
            <div className='Cards'>
                { (cards && cards.length > 0) ? (cards.map((card, index) => (
                    <Card currentCard = {[card, timesheetCode, UpdateTimeCode, UpdateCardTime, DeleteCard]} key = {index}/>
                    )) ): <p>Add Card</p>         
                }
            </div>
        </div>
    );
}

export default App;

