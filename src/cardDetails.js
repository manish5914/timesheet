import {v4 as uuid} from 'uuid';
const CardDetails = (startTime, endTime,combo, payCode, projectCode ) => ({
    id: uuid(),
    startTime: startTime,
    endTime: endTime,
    combo: combo,
    payCode: payCode, 
    projectCode: projectCode
})

export default CardDetails;