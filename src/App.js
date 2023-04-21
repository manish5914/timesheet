import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import CardDetails from './cardDetails';
import Card from './Card';

const App = () => {

  //const card = {startTime: '123', endTime: 'wer', timeCode: "3w4"}
  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState([]);
  
  function AddCard(i, startTime, endTime){
    return CardDetails(i, startTime, endTime);
  };
  function ClockIn() {
    var today = new Date().toLocaleString();
    let newArr = [...cards]
    if(newArr[index]){
      if(newArr[index].startTime === "start" ){
        newArr[index].startTime = today
      }else if(newArr[index].endTime === "end"){
        newArr[index].endTime = today;
        setIndex(index + 1);
      }
    }
    else{
      newArr.push(AddCard(index, today, "end"))
    }
    setCards(newArr);
  }
  
  useEffect(() => {}, []);
  return (
    <div className="App">
      <h1>TimeSheet</h1>
      {/* <button onClick={() => (
          AddCard(index, "start", "end", "timecode")
        )}>Add</button> */}
      <button onClick={() => (ClockIn())}>Clock In</button>
      
      <div className='Cards'>
           {cards.length > 0 ? cards.map((card) => (
           
             <div className='card'>
             <Card currentCard = {card}/>
             </div>

            )) : <p>Add Card</p>}
      </div>
    </div>
  );
}

export default App;
