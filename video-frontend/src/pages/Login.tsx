import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate()

    const [form , setForm] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const res = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.detail || "Invalid credentials")
                return 
            }

            localStorage.setItem('access', data.access)
            localStorage.setItem("refresh", data.refresh)

            navigate("/dashboard")
        } catch (err) {
            setError('Something went wrong')
        }
    }


    return (
        <form className="auth-container">
            <h1>Login</h1>

            {error && <p style ={{ color: "red"}} > {error} </p>}

            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button type="submit">Login</button>

            </form>
            
            <Link to="/register">Create account</Link>

        </form>
    )
}

export default Login