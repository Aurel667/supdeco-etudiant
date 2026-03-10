import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/sidebar";
import Header from "../components/layout/header";

export default function Layout(){
    return (
        <>
            <div className="flex flex-grow">
                <div className="fixed z-2">
                    <Sidebar />
                </div>
                <div className="h-screen px-4 py-2 flex-grow bg-gray-50 lg:pl-[55px] z-1">
                    <Header />
                    <Outlet />
                </div>
            </div>
        </>
    )
}
