export default function Loader({className}: {className?: string}){
    return (
        <div className={`border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin ${className || 'w-6 h-6 '}`}></div>
    )
}