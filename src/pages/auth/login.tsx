import { useState, } from "react"
import useAuthStore from "../../stores/auth.store"
import Loader from "../../components/loaders/loader"
import { useNavigate } from "react-router-dom"
import { Eye, EyeClosed } from "lucide-react"

export default function Login(){
    const navigate = useNavigate()
    const {login} = useAuthStore()
    const [state, setState] = useState({
        email: "",
        password: "",
        isLoading: false,
        error: "",
        seePassword: false
    })
    const handleLogin = async (e: any) => {
        e.preventDefault()
        setState((prev) => ({...prev, isLoading: true, error: ""}))
        try {
            const data = await login(state.email, state.password)
            if(data?.user?.id){
                navigate("/")
            }
            throw new Error(data?.message || "Une erreur est survenue lors de la connexion")
        } catch (error: any) {
            setState((prev) => ({...prev, error: error.message}))
        }
        finally {
            setState((prev) => ({...prev, isLoading: false}))
        }
    }
    return (
        <div className="bg-blue-100 h-[100vh] w-full flex items-center justify-center py-6">
            <div className=" bg-white shadow rounded py-2 px-4 md:w-1/3 w-4/5">
                <img src="/logo.png" alt="logo" className="bg-cover w-1/3 mx-auto" />
                <h2 className="text-center text-blue-800 font-bold text-3xl">Connexion</h2>
                
                <form onSubmit={handleLogin} className="px-4 py-6">
                    <div className="grid py-2">
                        <label className="font-semibold" htmlFor="mail">Adresse mail</label>
                        <input value={state.email} onChange={(e) => setState({...state, email: e.target.value})} type="email" className="border border-gray-300 rounded-md py-1 px-4 focus:outline-none" placeholder="Votre adresse email" required minLength={6} />
                    </div>
                    <div className="grid py-2">
                        <label className="font-semibold" htmlFor="mail">Mot de passe</label>
                        <div className="border border-gray-300 rounded-md flex items-center justify-between">
                            <input value={state.password} onChange={(e) => setState({...state, password: e.target.value})} type={state.seePassword ? "text" : "password"} className="py-1 px-4 focus:outline-none w-full" placeholder="Votre mot de passe" required minLength={6} />
                            <button onClick={() => setState({...state, seePassword: !state.seePassword})} className="focus:outline-none px-2" type="button">
                                {state.seePassword ? <Eye /> : <EyeClosed className="line-through" />}
                            </button>
                        </div>
                    </div>
                    {state.error != "" && (
                        <div className="text-red-600">
                            {state.error}
                        </div>
                    )}
                    <button className="rounded py-2 flex justify-center align-center font-semibold bg-blue-800 w-full text-white mt-4">
                        {state.isLoading ? <Loader /> : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    )
}