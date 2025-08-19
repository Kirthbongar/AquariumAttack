import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import "./App.css"; // keep your styles

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route is Login */}
          <Route path="/" element={<Login />} />
          {/* Register page */}
          <Route path="Register" element={<Register />} />
          {/* Dashboard page */}
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

