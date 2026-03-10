import {Outlet, Navigate} from "react-router-dom";
import useAuthStore from "../stores/auth.store";

export default function AuthProtectedRoutes(){
    const {user} = useAuthStore()
    if(!user){
        return <Navigate to={"/auth/login"} />
    }
    return <Outlet />
}