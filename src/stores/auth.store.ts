import type { UserInfo } from "../interfaces/auth.interface";
import type { User } from "../interfaces/user.interface";
import authService from "../services/auth.service";
import {create} from "zustand"

export interface IAuthStore{
    user: User | null,
    userInfo: UserInfo | null,
    isLoading: boolean,
    boot: () => Promise<void>,
    login: (email: string, password: string) => Promise<any>,
    logout: () => Promise<void>,
}

const useAuthStore = create<IAuthStore>((set) => ({
    user: null,
    userInfo: null,
    isLoading: true,
    boot: async () => {
        try {
            const {user, userInfo} = await authService.me();
            set({ user, userInfo, isLoading: false });
        } catch (error) {
            console.error('Erreur lors du boot:', error);
            set({ isLoading: false });
        }
    },
    login: async (email: string, password: string) => {
        const data = await authService.login(email, password);
        set({ user: data.user});
        return data
    },
    logout: async () => {
        await authService.logout();
        set({ user: null, userInfo: null});
    },
    
}))

export default useAuthStore