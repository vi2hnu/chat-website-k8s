import { useState } from "react";
import './login.css';

export default function AuthPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        conformpassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup
            ? "http://localhost:8000/api/auth/signup"
            : "http://localhost:8000/api/auth/login";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = "http://localhost:3000";
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    };

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setFormData({
            username: "",
            password: "",
            conformpassword: ""
        });
    };

    return (
        <div>
            <div className="auth-container">
                <h2 className="auth-title">{isSignup ? "Sign Up" : "Login"}</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div>
                        <label className="lable">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div>
                        <label className="lable">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                    {isSignup && (
                        <div>
                            <label className="lable" >Confirm Password:</label>
                            <input
                                type="password"
                                name="conformpassword"
                                value={formData.conformpassword}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>
                    )}
                    <button type="submit" className="auth-submit-btn">
                        {isSignup ? "Sign Up" : "Login"}
                    </button>
                </form>
                <button onClick={toggleForm} className="auth-toggle-btn">
                    {isSignup ? "Already have an account" : "Create New Account"}
                </button>
            </div>
        </div>
    );
}
