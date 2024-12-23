// import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // To store any error messages
    // const navigate = useNavigate();

    // @ts-ignore
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            //TODO: replace address with config
            const response = await fetch(`http://ec2-54-144-64-88.compute-1.amazonaws.com:4000/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Save the token and username to local storage
                onLoginSuccess(data.token); // Pass the token back to the parent
            } else {
                setError(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <div className="home">
            <h2>Sign in to your todo-list</h2>
            <form onSubmit={handleLogin} className="home__form">
                <label htmlFor="username">Your Username</label>
                <input
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                    required
                />
                <label htmlFor="password">Your Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    className="input"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
