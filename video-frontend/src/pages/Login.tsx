import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authServices";

const Login = () => {
    const navigate = useNavigate()

    const [form , setForm] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError([])
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError([])

         if (!form.username || !form.password) {
            setError(["All fields are required"]);
            return;
        }

    setLoading(true);

        try{
            const res = await loginUser(form);

            if (!res.success) {
                setError(res.errors);
                return;
            }
            navigate("/dashboard")

            localStorage.setItem('access', res.data.access)
            localStorage.setItem("refresh", res.data.refresh)

            navigate("/dashboard")
        } catch  {
            setError(['Something went wrong'])
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>Login</h1>
                <p> Welcome back! PLease eneter your details</p>
            </div>

            {/* {error && <p style ={{ color: "red"}} > {error[0]} </p>} */}
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
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                </div>

                
                <button
                    type="submit"
                    disabled={loading}
                    >
                    {loading ? "Signing in..." : "Login"}
                </button>

            </form>
            
            <Link to="/register">Create account</Link>

        </div>
    )
}

export default Login