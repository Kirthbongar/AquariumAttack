import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);
    const [gameProgress, setGameProgress] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userData = localStorage.getItem("user");
        
        if (!token) {
            navigate("/");
            return;
        }

        setAuthToken(token);
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch protected data
        Promise.all([
            API.get("/protected"),
            API.get("/game/progress"),
            API.get("/game/leaderboard?limit=5")
        ])
        .then(([protectedRes, progressRes, leaderboardRes]) => {
            setMessage(protectedRes.data.msg);
            setGameProgress(progressRes.data);
            setLeaderboard(leaderboardRes.data);
        })
        .catch((err) => {
            console.error("Dashboard data error:", err.response?.data || err.message);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
            }
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                await API.post("/auth/logout", { refreshToken });
            }
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setAuthToken(null);
            navigate("/");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">🐟 Insaniquarium Dashboard</h1>
                            <p className="text-gray-600">Welcome back, {user?.email}!</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Game Stats */}
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-blue-800">Your Game Stats</h2>
                            {gameProgress ? (
                                <div className="space-y-2">
                                    <p>🏆 High Score: <span className="font-bold">{gameProgress.highScore.toLocaleString()}</span></p>
                                    <p>💰 Total Coins Earned: <span className="font-bold">{gameProgress.totalCoinsEarned.toLocaleString()}</span></p>
                                    <p>⏱️ Total Play Time: <span className="font-bold">{Math.floor(gameProgress.totalPlayTime / 60)} minutes</span></p>
                                    <p>🎮 Games Played: <span className="font-bold">{gameProgress.gamesPlayed}</span></p>
                                    <p>📅 Last Played: <span className="font-bold">{new Date(gameProgress.lastPlayed).toLocaleDateString()}</span></p>
                                </div>
                            ) : (
                                <p className="text-gray-600">No game data yet. Start playing to see your stats!</p>
                            )}
                            
                            <Link 
                                to="/game"
                                className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg mt-6 hover:bg-blue-600 transition-colors font-semibold"
                            >
                                🎮 Play Game
                            </Link>
                        </div>

                        {/* Leaderboard */}
                        <div className="bg-yellow-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4 text-yellow-800">🏆 Top Players</h2>
                            {leaderboard.length > 0 ? (
                                <div className="space-y-3">
                                    {leaderboard.map((player, index) => (
                                        <div key={player._id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                                            <div className="flex items-center">
                                                <span className="text-lg font-bold text-gray-600 mr-3">#{index + 1}</span>
                                                <span className="text-sm text-gray-800">{player.userId.email.split('@')[0]}</span>
                                            </div>
                                            <span className="font-bold text-yellow-600">{player.highScore.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No leaderboard data yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center text-white">
                    <p className="opacity-75">{message}</p>
                </div>
            </div>
        </div>
    );
}