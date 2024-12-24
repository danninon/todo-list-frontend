import { useState, FormEvent } from "react";
import config from "../../config/default.ts";
import './SignUpForm.css';

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
        <form onSubmit={handleSignUp} className="signup-form">
            <label htmlFor="signUpUsername" className="signup-form__label">Username</label>
            <input
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="signup-form__input"
                required
            />
            <label htmlFor="signUpPassword" className="signup-form__label">Password</label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                className="signup-form__input"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="signup-form__button">Sign Up</button>
            {error && <p className="signup-form__error">{error}</p>}
        </form>
    );
};

export default SignUpForm;
