import { useEffect, useState } from "react";

export default function Home() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/", {
            method: "GET",
            credentials: "include" // ✅ Send cookies
        })
        .then(async (res) => {
            
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Unauthorized");
            }
            return res.json();
        })
        .then((data) => {
            setUser(data);
        })
        .catch((err) => {
            setError(err.message);
        });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Welcome, {user.username}</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}
