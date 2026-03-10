import {Routes, Route} from "react-router-dom";
import AuthProtectedRoutes from "../utils/authProtectedRoutes";
import GuestProtectedRoutes from "../utils/guestProtectedRoute";
import Dashboard from "../pages/dashboard";
import Error404 from "../pages/404";
import Login from "../pages/auth/login";
import Layout from "../pages/layout";

export default function AppRouter(){
    return (
        <Routes>
            <Route element={<GuestProtectedRoutes />}>
                <Route path="/auth/login" element={<Login />} />
            </Route>

            <Route element={<AuthProtectedRoutes />}>
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                </Route>
            </Route>

            <Route path="*" element={<Error404 />} />
        </Routes>
    )
}