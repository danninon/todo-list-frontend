import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // To store any error messages
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Save the token and username to local storage
                localStorage.setItem("token", data.token);
                localStorage.setItem("_username", username);

                // Navigate to the app
                navigate("/app");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <div className="home">
            <h2>Sign in to your todo-list</h2>
            <form onSubmit={handleSubmit} className="home__form">
                <label htmlFor="username">Your Username</label>
                <input
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                />
                <label htmlFor="password">Your Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button>SIGN IN</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Home;
