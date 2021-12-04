import React, { useEffect, useState } from "react";
import Login from "../pages/Login";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { useAuth } from '../context/auth';
import Dashboard from "../pages/Dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            </Routes>
        </Router>
    );
}

const RequireAuth = ({children}) => {
    const [authed, setAuthed] = useState(undefined);
    const { fetchCurrentUser } = useAuth();

    useEffect(() => {
        (async () => {
            const user = await fetchCurrentUser();
            setAuthed(user ? true : false)
        })();
    }, []);

    if (authed === undefined) return null;
    else return authed ? children : <Navigate to="/login" />
}

export default App;