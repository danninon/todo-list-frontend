import { useState } from "react";
import config from "../config/default";

const Login = ({ onLoginSuccess }: { onLoginSuccess: (token: string) => void }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // To store any error messages
    const [signUpError, setSignUpError] = useState(""); // Error messages for sign-up
    const [signUpUsername, setSignUpUsername] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");

    // Handle login submission
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                onLoginSuccess(data.token); // Pass the token back to the parent
            } else {
                setError(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again later.");
        }
    };

    // Handle sign-up submission
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: signUpUsername, password: signUpPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setSignUpUsername("");
                setSignUpPassword("");
                setSignUpError(""); // Clear any previous error
            } else {
                console.log(data);
                setSignUpError(`${data} Sign-up failed. Please try again.`);
            }
        } catch (err) {
            setSignUpError("Unable to connect to the server. Please try again later.");
        }
    };

    return (
        <div className="home">
            {/* Login Section */}
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

            {/* Sign-Up Section */}
            <h2>Create a new account</h2>
            <form onSubmit={handleSignUp} className="home__form">
                <label htmlFor="signUpUsername">Username</label>
                <input
                    value={signUpUsername}
                    placeholder="Username"
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    className="input"
                    required
                />
                <label htmlFor="signUpPassword">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={signUpPassword}
                    className="input"
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
                {signUpError && <p className="error">{signUpError}</p>}
            </form>
        </div>
    );
};

export default Login;
