import {v4 as uuid} from 'uuid';

type CardDetails = {
    id: string;
    startTime: string;
    endTime: string;
    combo: string;
    payCode: string;
    projectCode: string;
}
export default CardDetails;

export const CreateCard = (startTime: string, endTime: string, combo: string, payCode:string, projectCode:string, id?: string): CardDetails => ({
    id: id ? id : uuid(),
    startTime: startTime,
    endTime: endTime,
    combo: combo,
    payCode: payCode, 
    projectCode: projectCode
})
