import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "./components/Main/Main.tsx";
import Login from "./components/Login/Login.tsx";
import './App.css';
import { useEffect, useState } from "react";
import {isTokenExpired} from "./utils/tokenUtils.ts";

const App = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken= localStorage.getItem("token");
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
        localStorage.setItem("token", jwt);
        setToken(jwt);
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
