import {Outlet, Navigate} from "react-router-dom";
import useAuthStore from "../stores/auth.store";

export default function GuestProtectedRoutes(){
    const {user} = useAuthStore()
    if(user){
        return <Navigate to={"/"} />
    }
    return <Outlet />
}