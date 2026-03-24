
'use client'
import { logout } from "@/lib/actions"
import { Button } from "./ui/button"

const LogoutButton = () => {
    function deleteToken() {
        localStorage.removeItem('token')
    }
    return (
        <form action={logout}>
            <Button variant={'destructive'} type="submit" onClick={deleteToken}>Log out</Button>
        </form>

    )
}

export default LogoutButton