import { useState } from "react"
import {useNavigate, Link} from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        username:"",
        email:"",
        password1:"",
        password2:"",
    })

    const [error, setError] = useState([""])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()


        if (form.password1 !== form.password2) {
            setError(["Passwords do not match"])
            return 
        }

        try {
            const response = await fetch("http://localhost:8000/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.errors || ["Registration failed"])
                return
            }

            navigate("/login")
        }

        catch (err) {
            setError(["Something went wrong"])
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>Create Account</h1>
                <p> Join and Start sharing</p>
            </div>

        {error.length > 0 && (
            <ul className="error-list">
                {error.map((err, i) => (
                    <li key={i}>{err}</li>
                ))}
            </ul>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password1"
                        value={form.password1}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="password2"
                        value={form.password2}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Create Account</button>
            </form>

        </div>


    )
}   
