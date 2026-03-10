import { create } from "zustand";
import scheduleService from "../services/schedule.service";
import useDepartementStore from "./departement.store";

interface IScheduleState {
    schedule: any;
    loading: boolean;
    bootSchedule: () => Promise<void>;
    fetchSchedule: () => Promise<void>;
    getScheduleByDepartementId: (departementId: number) => Promise<any>;
    getScheduleByDepartementIdAndByDate: (departementId: number, startDate: string, endDate: string) => Promise<any>;
}

const useScheduleStore = create<IScheduleState>((set, get) => ({
    schedule: null,
    loading: true,
    bootSchedule: async () => { 
        get().fetchSchedule()
        .then(() => {
            set({loading: false})
        })
    },
    fetchSchedule: async () => {
        const {departements} = useDepartementStore.getState();
        await get().getScheduleByDepartementId(departements[0]?.id);
    },
    getScheduleByDepartementId: async (departementId: number) => {
        const data = await scheduleService.getScheduleByDepartmentId(departementId);
        set({schedule: data})     
    },
    getScheduleByDepartementIdAndByDate: async (departementId: number, startDate: string, endDate: string) => {
        const data = await scheduleService.getScheduleByDepartmentIdAndByDate(departementId, startDate, endDate);
        set({schedule: data})     
    }
}))

export default useScheduleStore