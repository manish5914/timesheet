export const REG_EX_TIME: RegExp = /([0-9]?[0-9]):([0-9][0-9]):([0-9][0-9])/;
export const DEFAULT_DATE: string = "1970-01-01T";
export const DEFAULT_TIME: string = "00:00:00";
export const DEFAULT_TIME_FORMAT: string = "HH:mm:ss";
export const DEFAULT_TIMESHEET_CODE: string = "Work";

export enum Hours{
    ZeroHour = 0
}
export const Log = (message: string, data: any, setLogMessage?: Function):void => {
    console.log(message, data);
    if(setLogMessage)
        setLogMessage(message);
}
export const ProcessDate = (date: Date): string => {
    return date.toISOString().substring(0, 10);
}

export const CalculateHours = (startTime: string, endTime: string): number =>{

    if((startTime && startTime === DEFAULT_TIME ) || (endTime && endTime === DEFAULT_TIME)){
        return Hours.ZeroHour;
    }
    
    if(!IsCorrectTimeFormat(startTime) || !IsCorrectTimeFormat(endTime))
        return Hours.ZeroHour;

    let x = new Date(DEFAULT_DATE + startTime);
    let y = new Date(DEFAULT_DATE + endTime);

    return y.getTime() - x.getTime();
}

const IsCorrectTimeFormat = (time: string): boolean => {
    if (!time)
        return false;
    return REG_EX_TIME.test(time);  
}