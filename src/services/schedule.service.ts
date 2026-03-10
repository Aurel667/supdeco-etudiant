import { apiGetScheduleByDepartmentId } from "../api/schedule.api";

const scheduleService = {
    getScheduleByDepartmentId: async (departmentId: number) => {
        const params = {
            department_id: departmentId,
            ...(getCurrentWeekInterval())
        }
        const data = await apiGetScheduleByDepartmentId(params);
        return data;
    },
    getScheduleByDepartmentIdAndByDate: async (departmentId: number, startDate: string, endDate: string) => {
        const params = {
            department_id: departmentId,
            startDate: startDate,
            endDate: endDate
        }
        const data = await apiGetScheduleByDepartmentId(params);
        return data;
    }

}

function getCurrentWeekInterval() {
    const monday = new Date().setDate(new Date().getDate() - (new Date().getDay() - 1));
    const sunday = new Date().setDate(new Date(monday).getDate() + 6);
    const startDate = new Date(monday).toISOString().split('T')[0];
    const endDate = new Date(sunday).toISOString().split('T')[0];
    return {
        startDate: startDate,
        endDate: endDate,
    };
}

export default scheduleService