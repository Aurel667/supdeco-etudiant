import {Outlet, Navigate} from "react-router-dom";
import useAuthStore from "../stores/auth.store";
import Loader from "../components/loaders/loader";

export default function GuestProtectedRoutes(){
    const {user, isLoading} = useAuthStore()
    if(isLoading){
        return (<div className="h-[100vh] w-full flex items-center justify-center">
            <Loader className="w-12 h-12" />
        </div>)
    }
    if(user){
        return <Navigate to={"/"} />
    }
    return <Outlet />
}