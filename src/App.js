import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import CardDetails from './cardDetails';
import Card from './Card';
import axios from 'axios';
import { Tooltip } from 'bootstrap';

//const
//json-server --watch --port 8000 timesheet.json
const timesheet_api = "http://localhost:8000/";
const timesheet_saved_data_api = "http://localhost:8000/timeSheet/";

const App = () => {

  //const card = {startTime: '123', endTime: 'wer', timeCode: "3w4"}
  const [cards, setCards] = useState([]);
  const [timesheetCode, setTimesheetCode] = useState();
  const today = new Date().toISOString().substring(0,10); 

  //api
   const GetTimesheetCode = async() => {
    axios.get(timesheet_api + "combo")
    .then(response => (
          setTimesheetCode(response.data)
        ));
  }
  const PostSaveTimeSheet = async(saveData) => {
    var timesheetData = {id: today, saveData}
    axios.post(timesheet_api + "timeSheet", timesheetData)
    .then((response) => console.log("Data saved", response))
    .catch((error)=> console.log("failed", error.response.data));
  }
  const GetCardsUsingDate = async(timesheetDateId) => {
    axios.get(timesheet_saved_data_api + timesheetDateId)
    .then((response) => {
      console.log("Got Cards", response.data); 
      loadCards(response.data)
    })
    .catch((error) => {
      error.response.status === 404 ? console.log(error.message) : console.log("failed to fetch data", error.response)
    })
  }
  const DeleteCardsUsingDate = async(timesheetDateId) => {
    axios.delete(timesheet_saved_data_api + timesheetDateId)
    .then((response) => {console.log("Deleted", response)})
    .catch((error) => {console.log("failed", error.response.data)})
  }
  //functions
  function loadCards(cardsData){
    setCards(cardsData.saveData);
  }
  function updateCards(cardIndex, timeSheetIndex){
    let newArr = [...cards];
    if(newArr[cardIndex]){
      newArr[cardIndex].id = timesheetCode[timeSheetIndex].id;
      newArr[cardIndex].projectCode = timesheetCode[timeSheetIndex].projectCode;
      newArr[cardIndex].payCode = timesheetCode[timeSheetIndex].payCode;
    }
    setCards(newArr);
    console.log(cardIndex);
  }
  function AddCard(startTime, endTime, timeDetails){
    return CardDetails(startTime, endTime,timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
  };
  function ClockIn() {
    var currentTime = new Date().toLocaleTimeString().substring(0, 8);
    let newArr = [...cards];
    let lastItemIndex = newArr.length - 1;
    console.log(newArr, lastItemIndex, newArr[lastItemIndex]);
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
    console.log("saving");
    PostSaveTimeSheet(cards);
  }
  function DeleteAll(date){
    DeleteCardsUsingDate(date);
    setCards([]);
  }
  useEffect(() => {GetTimesheetCode(); GetCardsUsingDate(today)}, []);
  return (
    <div className="App">
      <h1>TimeSheet</h1>
      <button onClick={() => (ClockIn())}>Clock In</button>
      <button onClick={() => (Save())}>Save</button>
      <button onClick={() => DeleteAll(today)}>Delete</button>
      <div className='Cards'>
           {cards.length > 0 ? cards.map((card) => (
           
             <div className='card'>
             <Card currentCard = {[card, timesheetCode, updateCards]}/>
             </div>

            )) : <p>Add Card</p>}
      </div>
    </div>
  );
}

export default App;
