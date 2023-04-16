import React from "react";
import {useState} from "react";

const Card = ({currentCard}) =>
{
    const [timeCodes, setTimeCodes] = useState(["meal", "work", "bug", "enhanceemtn"])
    return (
        <div className="Card">
            <div>
                <p>{currentCard.startTime ? currentCard.startTime : "StartTime"}</p>
            </div>
            <div>
                <p>{currentCard.endTime ? currentCard.endTime : "EndTime"}</p>
            </div>
            <ul>
               {timeCodes.map((timeCode) => (
                <DropDownItem item = {timeCode}/>
               ))}
            </ul>
        </div>
    )
}
const DropDownItem = ({item}) => {
   return( <li>
        {item}
    </li>)
}
export default Card;