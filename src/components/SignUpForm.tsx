import { useState, FormEvent } from "react";
import config from "../config/default";

const SignUpForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setUsername("");
                setPassword("");
                setError(""); // Clear any previous error
            } else {
                setError(data.error || "Sign-up failed. Please try again.");
            }
        } catch {
            setError("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleSignUp} className="home__form">
            <label htmlFor="signUpUsername">Username</label>
            <input
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
            />
            <label htmlFor="signUpPassword">Password</label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                className="input"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sign Up</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default SignUpForm;
