import { useState, FormEvent } from "react";
import config from "../config/default";

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                onLoginSuccess(data.token);
            } else {
                setError(data.error || "Login failed. Please try again.");
            }
        } catch {
            setError("Unable to connect to the server. Please try again later.");
        }
    };

    return (
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
    );
};

export default LoginForm;

