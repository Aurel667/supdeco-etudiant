import { Home, LogOut, SidebarClose, SidebarOpen, List } from "lucide-react"
import useAuthStore from "../../stores/auth.store"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Sidebar(){
    const {user, userInfo, logout} = useAuthStore()
    const [state, setState] = useState({
        isOpen: false
    })
    return (
        <>
        {!state.isOpen && <div className="lg:bg-blue-900 lg:h-screen lg:w-[50px] transition-all duration-300 flex lg:items-start items-center justify-center lg:py-3 py-2 px-2 lg:block shadow lg:shadow-none bg-gray-800 lg:rounded-none rounded lg:relative absolute lg:top-0 top-5 lg:right-0 -right-[90vw] z-[20]">
            <button className="rounded cursor-pointer" onClick={() => setState({...state, isOpen: !state.isOpen})}>
                <SidebarOpen className="w-5 h-5 text-white" />
            </button>
        </div>}
        <div className={`bg-blue-900 h-screen z-[10] w-[250px] ${state.isOpen ? 'block' : 'hidden'} transition-all duration-300`}>
            <div className="bg-white/10 px-4 py-2">
                <div className="flex items-center justify-between">
                    <img className="w-12" src="/logo_white.png" alt="logo" />
                    <button className="text-white hover:bg-white/10 rounded cursor-pointer" onClick={() => setState({...state, isOpen: !state.isOpen})}>
                        {state.isOpen ? <SidebarClose className="w-5 h-5 text-white" /> : <SidebarOpen className="w-5 h-5 text-white" />}
                    </button>
                </div>
                <div className="p-4 border-t border-white/20">
                    <h1 className="text-lg font-bold text-white">{user?.firstName}</h1>
                    <p className="text-white text-sm">{userInfo?.email}</p>
                </div>
            </div>
            <div className="flex flex-col h-full gap-4">
                <ul className="p-4">
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            <Link to={item.url} className="text-white hover:bg-white/10 rounded cursor-pointer px-4 py-2 flex items-center">
                                <item.icon className="w-5 h-5 inline mr-2" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    
                </ul>

                <button onClick={logout} className="rounded bg-red-700/70 text-white gap-2 font-bold px-4 py-2 m-4 cursor-pointer flex items-center justify-center">
                    <LogOut className="w-4 h-4" /> Déconnexion
                </button>
            </div>
        </div>
        </>
    )
}

const menuItems = [
    {
        name: "Dashboard",
        url: "/",
        icon: Home
    },
    {
        name: "Departements",
        url: "/departments",
        icon: List 
    }
    // {
    //     name: "Planning",
    //     url: "/planning"
    // },
    // {
    //     name: "Settings",
    //     url: "/settings"
    // }
]