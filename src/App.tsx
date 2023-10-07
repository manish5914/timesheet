import * as React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import CardDetails from './cardDetails';
import TimeSheetCodes from './timeSheetCode';
import Card from './Card';
import Api from './api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AxiosResponse, AxiosError} from "axios";

enum DefaultTime {
    startTime = "00:00:00",
    endTime = "00:00:00"
}

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
        .then((response:AxiosResponse) => logger("Data saved", response))
        .catch((error:any)=> logger("failed", error.response.data));
    }
    const GetCardsUsingDate = async(timesheetDateId: Date) => {
        api.getCardsUsingDate(processDate(timesheetDateId))
        .then((response:AxiosResponse) => {
            logger("Got Cards", response.data);
            setCards(response.data.saveData);
            //todo: data not updating in cards 
        })
        .catch((error:any) => {
            if(error.response.data.lenght === 0){
                logger("No Data for this date", error.response)
            }
            else{
                logger("No data received for this date", error.response)
            }
            setCards([]);
        })
    }
    const DeleteCardsUsingDate = async(timesheetDateId: Date) => {
        api.deleteCardsUsingDate(processDate(timesheetDateId))
        .then((response:AxiosResponse) => {logger("Deleted", response)})
        .catch((error:any) => {logger("failed", error.response.data)})
    }
    //functions
    function processDate(date: Date): string{
        return date.toISOString().substring(0, 10);
    }
    const updateCardTime = (cardUUID: string, timeValue: string, type: string) =>{
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
    const updateTimeCode = (cardUUID: string, timeSheetIndex: number) => {
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
    
    function AddCard(startTime: string, endTime: string, timeDetails?: TimeSheetCodes): CardDetails {
        if(timeDetails)
            return CardDetails(startTime, endTime, timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
        else
            return CardDetails(DefaultTime.startTime, DefaultTime.endTime, "null", "Work", "Work");
    };
    function ClockIn() {
        setCards((cardValue) => {
            var currentTime = new Date().toLocaleTimeString().substring(0, 8);
            let newArr = [...cardValue];
            let lastItemIndex = newArr.length - 1;
            if(newArr[lastItemIndex]){
                if(newArr[lastItemIndex].startTime === "start" ){
                    newArr[lastItemIndex].startTime = currentTime
                }
                else if(newArr[lastItemIndex].endTime === "00:00:00"){
                    newArr[lastItemIndex].endTime = currentTime;
                }
                else{
                    newArr.push(AddCard(currentTime, "00:00:00", timesheetCode.find(x => x.id === "Work")));
                }
            }
            else{
                newArr.push(AddCard(currentTime, "00:00:00", timesheetCode.find(x => x.id === "Work")));
            }
            return newArr;
        });
    }
    function Save(){
        let lastCard = cards[cards.length -1];
        if(lastCard == null){
            logger("list of cards empty", "");
            return; 
        }
        if(lastCard.endTime === "00:00:00"){
            logger("timesheet not Complete", "");
            return; 
        }
        api.getCardsUsingDate(processDate(currentDate))
        .then(() => {
            api.deleteCardsUsingDate(processDate(currentDate))
            .then(() => {
                PostSaveTimeSheet(cards, processDate(currentDate));
            })
            .catch((error: any) => {logger("could save as delete error", error.message)});
        })
        .catch(() => {
            PostSaveTimeSheet(cards, processDate(currentDate));
        });
    }
    function DeleteAll(date: Date){
        DeleteCardsUsingDate(date);
        setCards([]);
    }
    function logger(type: string , data: any){
        console.log(type, data);
        setLogMessage(type);
    }
    useEffect(() => {GetTimesheetCode();}, []);
    useEffect(() => {GetCardsUsingDate(currentDate)},[currentDate])
    return (
        <div className="App">
        <h1>TimeSheet</h1>
        <h2 className='Messages'>{logMessage}</h2>
        <button onClick={() => (ClockIn())}>Clock In</button>
        <button onClick={() => (Save())}>Save</button>
        <button onClick={() => (DeleteAll(currentDate))}>Delete</button>
        <DatePicker selected={currentDate} onChange={(date: Date) => {setCurrentDate(date)}}/>
        <div className='Cards'>
            { (cards && cards.length > 0) ? (cards.map((card) => (
                <div className='card'>
                <Card currentCard = {[card, timesheetCode, updateTimeCode, updateCardTime]}/>
                </div>
                )) ): <p>Add Card</p>         
            }
        </div>
        </div>
    );
}

export default App;
