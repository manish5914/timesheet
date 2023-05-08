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


const App = () => {

  //const card = {startTime: '123', endTime: 'wer', timeCode: "3w4"}
  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [timesheetCode, setTimesheetCode] = useState();

   const GetTimesheetCode = async() => {
    axios.get(timesheet_api + "combo")
    .then(
      response => (
          setTimesheetCode(response.data)
        )
      );
  }
  const PostSaveTimeSheet = async(saveData) => {
    var today = new Date().toLocaleDateString(); 
    var timesheetData = {id: today, saveData}
    axios.post(timesheet_api + "timeSheet", timesheetData);
  }
  function updateCards(cardIndex, timeSheetIndex){
    let newArr = [...cards];
    if(newArr[cardIndex]){
      newArr[cardIndex].id = timesheetCode[timeSheetIndex].id;
      newArr[cardIndex].projectCode = timesheetCode[timeSheetIndex].projectCode;
      newArr[cardIndex].payCode = timesheetCode[timeSheetIndex].payCode;
    }
    setCards(newArr);
  }
  function AddCard(i, startTime, endTime, timeDetails){
    return CardDetails(i, startTime, endTime,timeDetails.id, timeDetails.projectCode, timeDetails.payCode);
  };
  function ClockIn() {
    var currentTime = new Date().toLocaleTimeString().substring(0, 5);
    let newArr = [...cards]
    if(newArr[index]){
      if(newArr[index].startTime === "start" ){
        newArr[index].startTime = currentTime
      }else if(newArr[index].endTime === "end"){
        newArr[index].endTime = currentTime;
        setIndex(index + 1);
      }
    }
    else{
      newArr.push(AddCard(index, currentTime, "end", timesheetCode.find(x => x.id === "Work")));
    }
    setCards(newArr);
  }
  function Save(){
    console.log("saving");
    PostSaveTimeSheet(cards);
  }
  useEffect(() => {GetTimesheetCode();}, []);
  return (
    <div className="App">
      <h1>TimeSheet</h1>
      {/* <button onClick={() => (
          AddCard(index, "start", "end", "timecode")
        )}>Add</button> */}
      <button onClick={() => (ClockIn())}>Clock In</button>
      <button onClick={() => (Save())}>Save</button>
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
