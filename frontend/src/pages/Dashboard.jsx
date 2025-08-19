import { useEffect, useState } from "react";
import API, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // fix key
        if (!token) {
            navigate("/");
        } else {
            setAuthToken(token);
            API.get("/protected")
                .then((res) => setMessage(res.data.msg))
                .catch((err) => {
                    console.error("Protected route error:", err.response?.data || err.message);
                    navigate("/");
                });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        setAuthToken(null);
        navigate("/");
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>{message}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}