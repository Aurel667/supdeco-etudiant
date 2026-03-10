import {create} from 'zustand'
import useDepartementStore from './departement.store'

interface BootState {
    isBooted: boolean
    bootApp: () => Promise<void>
}

export const useBootStore = create<BootState>(() => ({
    isBooted: true,
    bootApp: async () => {
        const {bootDepartement} = useDepartementStore.getState();
        Promise.all([
            bootDepartement(),
        ])
        
    }
}))