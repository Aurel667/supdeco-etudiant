import { useEffect } from "react"
import useAuthStore from "../stores/auth.store"
import { useBootStore } from "../stores/boot.store"

export default function AutoAuth(){
    const {user, boot} = useAuthStore()
    const {bootApp} = useBootStore()
    useEffect(() => {
        boot()
        ?.then(() => {
            bootApp()
        })

    }, [user?.id])
    return (
        <></>
    )
}