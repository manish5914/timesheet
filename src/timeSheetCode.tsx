interface TimeSheetCodes{
    id: string;
    payCode: string;
    projectCode: string;
}

export const CreateTimeSheetCodes = (id: string, payCode: string, projectCode: string) => ({
    id: id, 
    payCode: payCode,
    projectCode: projectCode
})

export default TimeSheetCodes;