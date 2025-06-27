import { useContext, useState } from "react";
import UserContext from "../UserContext";
import "../App.css";

function Login() {
    const { user, setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "admin",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    localStorage.removeItem("user");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user.role !== formData.role) {
                    setError(`This user is not registered as a ${formData.role}`);
                    return;
                }

                setUser(data.user);
                alert("Login successful!");
                window.location.href = "/dashboard";
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <h1>Macmillan School</h1>
                <p>Dream__ Believe __  Achieve</p>
            </div>

            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Role:
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="admin">Admin</option>
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
                    </label>

                    <label>
                        Username:
                        <input name="username" value={formData.username} onChange={handleChange} required />
                    </label>

                    <label>
                        Password:
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </label>

                    <button type="submit">Login</button>
                    {error && <p className="error">{error}</p>}
                </form>

                {user && (
                    <p>
                        Logged in as: <strong>{user.username}</strong> ({user.role})
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;
