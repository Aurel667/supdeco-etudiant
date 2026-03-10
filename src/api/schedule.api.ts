import client from "../config/api-client.config";
import type { GetScheduleByIdParams } from "../interfaces/schedule.interface";

export const apiGetScheduleByDepartmentId = async (params: GetScheduleByIdParams) => {
    const response = await client.get("/emploi-du-temps/departement/weekly", {params});
    return response.data;
}