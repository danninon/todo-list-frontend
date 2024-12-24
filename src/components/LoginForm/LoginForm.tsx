import { useState, FormEvent } from "react";
import config from "../../config/default.ts";
import './LoginForm.css'

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
        <form onSubmit={handleLogin} className="login-form">
            <label htmlFor="username" className="login-form__label">Your Username</label>
            <input
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="login-form__input"
                required
            />
            <label htmlFor="password" className="login-form__label">Your Password</label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                className="login-form__input"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="login-form__button">Login</button>
            {error && <p className="login-form__error">{error}</p>}
        </form>
    );
};

export default LoginForm;

