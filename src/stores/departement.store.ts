import {create} from "zustand";
import departementService from "../services/departement.service";

interface IDepartementStore {
    departements: any[],
    isLoading: boolean,
    bootDepartement: () => Promise<void>,
    fetchAllDepartements: () => Promise<void>
}

const useDepartementStore = create<IDepartementStore>((set, get) => ({
    departements: [],
    currentDepartement: null,
    isLoading: true,
    bootDepartement: async () => {
        get().fetchAllDepartements()
        .then(() => {
            set({ isLoading: false });
        })
    },
    fetchAllDepartements: async () => {
        set({ isLoading: true });
        try {
            const data = await departementService.getAllDepartements();
            set({ departements: data });
        } finally {
            set({ isLoading: false });
        }
    }
}))

export default useDepartementStore;