import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { AuthContext } from "../auth.context"
import { logout } from "../services/auth.api"

const LogoutButton = ({ className = "" }) => {
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [error, setError] = useState("")

    const handleLogout = async () => {
        setIsLoggingOut(true)
        setError("")

        try {
            await logout()
            setUser(null)
            navigate("/login", { replace: true })
        } catch {
            setError("Unable to log out. Please try again.")
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className={`logout-control ${className}`}>
            <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
                disabled={isLoggingOut}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
            {error && <p className="logout-error" role="alert">{error}</p>}
        </div>
    )
}

export default LogoutButton
