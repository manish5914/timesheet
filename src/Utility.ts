export enum DefaultTime {
    startTime = "00:00:00",
    endTime = "00:00:00"
}

export const Log = (message: string, data: any, setLogMessage?: Function):void => {
    console.log(message, data);
    if(setLogMessage)
        setLogMessage(message);
}
export const ProcessDate = (date: Date): string => {
    return date.toISOString().substring(0, 10);
}