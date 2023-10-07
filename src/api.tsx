import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios';
//json-server --watch --port 8000 timesheet.json
export default class Api{

    timesheet_api: string;
    client: AxiosInstance;
    config: CreateAxiosDefaults;

    constructor() {
        this.timesheet_api = "http://localhost:8000";
        this.config = {
            baseURL: this.timesheet_api        }
    }
    init = () => { 
        this.client = axios.create({
            baseURL: this.timesheet_api, 
            timeout: 5000
        })
        return this.client;
    }
    getTimesheetCodes = () => {
        return this.init().get("/combo");
    }
    getCardsUsingDate = (timesheetDate: string) => {
        return this.init().get("/timesheet/" + timesheetDate);
    }
    postSaveTimesheet = (saveData: any) => {
        return this.init().post("/timesheet", saveData);
    } 
    deleteCardsUsingDate = (timesheetDate: string) => {
        return this.init().delete("/timesheet/" + timesheetDate);
    } 
}
