import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import CardDetails from './cardDetails';
import Card from './Card';
const App = () => {

  //const card = {startTime: '123', endTime: 'wer', timeCode: "3w4"}
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [cards, setCards] = useState([]);
  
  function AddCard(index, startTime, endTime, timeCode){
    setCards(oldCards => [...oldCards, CardDetails(index, startTime, endTime, timeCode)]);
    setIndex(index+1);
    console.log(cards);
  };
  function ClockIn() {
    var today = new Date().toLocaleString();
    let newArr = [...cards]
    if(newArr[nextIndex]){
      if(newArr[nextIndex].startTime === "start" ){
        newArr[nextIndex].startTime = today
      }else if(newArr[nextIndex].endTime === "end"){
        newArr[nextIndex].endTime = today;
      }
      else{
        setNextIndex(nextIndex + 1);
      }
    }
    setCards(newArr);
    console.log(cards[nextIndex], index, nextIndex);
    console.log(cards);
  }
  
  useEffect(() => {}, []);
  return (
    <div className="App">
      <h1>TimeSheet</h1>
      <button onClick={() => (
          AddCard(index, "start", "end", "timecode")
        )}>Add</button>
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
