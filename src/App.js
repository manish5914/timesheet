import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import CardDetails from './cardDetails';
import Card from './Card';
import Api from './api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {

    const [cards, setCards] = useState([]);
    const [timesheetCode, setTimesheetCode] = useState();
    const [currentDate, setCurrentDate] = useState(new Date());

    const api = new Api();
    //api
    const GetTimesheetCode = () => {
        api.getTimesheetCodes()
        .then(response => (
            setTimesheetCode(response.data)
        ));
    }
    const PostSaveTimeSheet = async(saveData, date) => {
        var timesheetData = {id: date, saveData};
        api.postSaveTimesheet(timesheetData)
        .then((response) => console.log("Data saved", response))
        .catch((error)=> console.log("failed", error.response.data));
    }
    const GetCardsUsingDate = async(timesheetDateId) => {
        api.getCardsUsingDate(processDate(timesheetDateId))
        .then((response) => {
            console.log("Got Cards", response.data);
            setCards(response.data.saveData);
            //todo: data not updating in cards 
        })
        .catch((error) => {
            console.log("failed to fetch data", error.response)
            setCards([]);
        })
    }
    const DeleteCardsUsingDate = async(timesheetDateId) => {
        api.deleteCardsUsingDate(processDate(timesheetDateId))
        .then((response) => {console.log("Deleted", response)})
        .catch((error) => {console.log("failed", error.response.data)})
    }
    //functions
    function processDate(date){
        return date.toISOString().substring(0, 10);
    }
    function updateCards(card, timeSheetIndex){
        let newArr = [...cards];
        let cardIndex = newArr.findIndex(x => x.id === card);
        if(newArr[cardIndex]){
            newArr[cardIndex].combo = timesheetCode[timeSheetIndex].id;
            newArr[cardIndex].projectCode = timesheetCode[timeSheetIndex].projectCode;
            newArr[cardIndex].payCode = timesheetCode[timeSheetIndex].payCode;
        }
        setCards(newArr);
    }
    function AddCard(startTime, endTime, timeDetails){
        return CardDetails(startTime, endTime,timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
    };
    function ClockIn() {
        var currentTime = new Date().toLocaleTimeString().substring(0, 8);
        let newArr = [...cards];
        let lastItemIndex = newArr.length - 1;
        if(newArr[lastItemIndex]){
            if(newArr[lastItemIndex].startTime === "start" ){
                newArr[lastItemIndex].startTime = currentTime
            }else if(newArr[lastItemIndex].endTime === "end"){
                newArr[lastItemIndex].endTime = currentTime;
            }
            else{
                newArr.push(AddCard(currentTime, "end", timesheetCode.find(x => x.id === "Work")));
            }
        }
        else{
        newArr.push(AddCard(currentTime, "end", timesheetCode.find(x => x.id === "Work")));
        }
        setCards(newArr);
    }
    function Save(){
        let lastCard = cards[cards.length -1];
        if(lastCard == null){
            console.log("Last card not found");
            return; 
        }
        if(lastCard.endTime === "end"){
            console.log("timesheet not Complete");
            return; 
        }
        api.getCardsUsingDate(processDate(currentDate))
        .then(() => {
            api.deleteCardsUsingDate(processDate(currentDate))
            .then(() => {
                PostSaveTimeSheet(cards, processDate(currentDate));
            })
            .catch((error) => {console.log("could save as delete error", error.message)});
        })
        .catch(() => {
            PostSaveTimeSheet(cards, processDate(currentDate));
        });
    }
    function DeleteAll(date){
        DeleteCardsUsingDate(date);
        setCards([]);
    }
    useEffect(() => {GetTimesheetCode();}, []);
    useEffect(() => {GetCardsUsingDate(currentDate)},[currentDate])
    return (
        <div className="App">
        <h1>TimeSheet</h1>
        <button onClick={() => (ClockIn())}>Clock In</button>
        <button onClick={() => (Save())}>Save</button>
        <button onClick={() => (DeleteAll(currentDate))}>Delete</button>
        <DatePicker selected={currentDate} onChange={(date) => {setCurrentDate(date)}}/>
        <div className='Cards'>
            {cards.length > 0 ? cards.map((card) => (
                <div className='card'>
                <Card currentCard = {[card, timesheetCode, updateCards]}/>
                </div>
                )) : <p>Add Card</p>         
            }
        </div>
        </div>
    );
}

export default App;
