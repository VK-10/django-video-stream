import { useState, type ReactElement } from "react"
import {useNavigate, Link} from "react-router-dom"
import { registerUser } from "../services/authServices"

const RegisterPage = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        username:"",
        email:"",
        password1:"",
        password2:"",
    })
    const [loading , setLoading] = useState(false)

    const [error, setError] = useState([])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setError([])
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError([])
        if (form.password1 !== form.password2) {
            setError(["Password do not match"])
            return 
        }

        setLoading(true)

        try {
            const result = await registerUser(form);

            if (!result.success) {
                setError(result.errors)
                return
            }

            navigate("/login")
        }

        catch (err) {
            setError(["Something went wrong"])
        }
        finally {
            setLoading(false)
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

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                </button>

            </form>

        </div>


    )
}   

export default RegisterPage
