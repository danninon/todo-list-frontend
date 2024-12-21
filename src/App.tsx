import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login.tsx";

import './App.css';
import {useState} from "react";

const App = () => {
    const [token, setToken] = useState<string | null>(null);

    const handleLoginSuccess = (jwt: string) => {
        localStorage.setItem("token", jwt); // Store the token
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