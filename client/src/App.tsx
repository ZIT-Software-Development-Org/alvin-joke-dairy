import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/LogIn";
import  SignUp from "./Pages/SignUp"; 
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="login/" element={<Login />} /> {/* Default Route */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
