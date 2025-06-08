import { useState } from "react";

export default function AuthPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        conformpassword: ""
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isSignup ? "http://localhost:8000/api/auth/signup" : "http://localhost:8000/api/auth/login";

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
            console.log(error)
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
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {isSignup && (
                    <div>
                        <label>Confirm Password: </label>
                        <input
                            type="password"
                            name="conformpassword"
                            value={formData.conformpassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}
                <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
            </form>
            <button onClick={toggleForm}>
                {isSignup ? "Switch to Login" : "Switch to Sign Up"}
            </button>
        </div>
    );
}
