import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("request"); // "request" or "reset"
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
            setStep("reset");
        }
    }, [searchParams]);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/auth/request-password-reset", { email });
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err) {
            setMessage(err.response?.data?.msg || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match!");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Password must be at least 6 characters long!");
            return;
        }

        setLoading(true);
        try {
            await API.post("/auth/reset-password", { token, newPassword });
            setMessage("Password reset successful! You can now log in.");
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.msg || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {step === "request" ? (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
                        
                        <form onSubmit={handleRequestReset} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Reset Email"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Set New Password</h2>
                        
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}

                {message && (
                    <p className={`text-center mt-4 ${message.includes("successful") || message.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                <div className="text-center mt-6">
                    <button 
                        onClick={() => navigate("/")}
                        className="text-blue-500 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}