import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async() => {
            await fetch("/api/logout/", {
                method: "POST",
                credentials: "include"
            })

            navigate("/login")
        }

        logout()
    }, [])

    return (
        <div className="success-container">
            <h1>Signing Out...</h1>
            <p>You are being logged out.</p>
        </div>
    )


}

export default Logout