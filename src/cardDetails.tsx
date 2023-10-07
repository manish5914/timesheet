import {v4 as uuid} from 'uuid';

type CardDetails = {
    id: string;
    startTime: string;
    endTime: string;
    combo: string;
    payCode: string;
    projectCode: string;
}
const CardDetails = (startTime: string, endTime: string, combo: string, payCode:string, projectCode:string ) => ({
    id: uuid(),
    startTime: startTime,
    endTime: endTime,
    combo: combo,
    payCode: payCode, 
    projectCode: projectCode
})

export default CardDetails;