import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login.tsx";
import './App.css';
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

const App = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            if (isTokenExpired(savedToken)) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                setToken(null);
            } else {
                setToken(savedToken);
            }
        }
    }, []);

    const handleLoginSuccess = (jwt: string) => {
        localStorage.setItem("token", jwt); // Store the token
        setToken(jwt);
    };

    const isTokenExpired = (token: string): boolean => {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={!token ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/app" />}
                />
                <Route path="/app" element={token ? <Main token={token} /> : <Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};
export default App;
