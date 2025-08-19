import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game"; // New game page
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route is Login */}
          <Route path="/" element={<Login />} />
          {/* Register page */}
          <Route path="/register" element={<Register />} />
          {/* Dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Game page */}
          <Route path="/game" element={<Game />} />
          {/* Password reset page */}
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;