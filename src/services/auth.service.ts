import type { LoginPayload } from "../interfaces/auth.interface";
import { apiLogin, apiLogout, apiMe } from "../api/auth.api";


const authService = {
    login: async (email: string, password: string) => {
        const payload: LoginPayload = { email: email, password, plateforme: "academies" };
        const data = await apiLogin(payload);
        if(data.token){
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },
    logout: async () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        await apiLogout();
    },
    me: async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const user = localStorage.getItem('user');
            let userInfo;
            if(token){
                userInfo = await apiMe();
            }
            if(userInfo?.id){
                return {user: JSON.parse(user as string), userInfo}
            }
            return {user: null, userInfo: null};
        } catch (error) {
            return {user: null, userInfo: null};
        }
    },
}

export default authService