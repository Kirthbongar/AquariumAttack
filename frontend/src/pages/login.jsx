import { useState } from "react";
import API, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", {email, password});
            const token = res.data.accessToken;
            localStorage.setItem("accessToken", token);
            setAuthToken(token);
            setMessage("Login successful!");
            navigate("/Dashboard");
        } catch (err) {
            setMessage(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            /><br/>
        <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            /><br/>
            <button type="submit">Login</button>
        </form>
        <p>{message}</p>
        </div>
    );
}