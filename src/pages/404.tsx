export default function Error404(){
    return (
        <div className="flex flex-col items-center pt-20 h-screen bg-blue-100"> 
            <img src="/logo.png" alt="logo" className="bg-cover w-50 h-50 mx-auto" />
            <div>
                <h1 className="text-7xl font-bold text-blue-900">404</h1>
                <p className="text-lg text-gray-900 mt-2">Page non trouvée</p>
            </div>
        </div>
    )
}