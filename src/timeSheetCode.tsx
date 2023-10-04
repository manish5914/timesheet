interface TimeSheetCodes{
    id: string;
    payCode: string;
    projectCode: string;
}

const TimeSheetCodes = (id: string, payCode: string, projectCode: string) => ({
    id: id, 
    payCode: payCode,
    projectCode: projectCode
})

export default TimeSheetCodes;