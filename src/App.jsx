import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import MessageScheduler from "./components/MessageScheduler";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/schedule" element={<MessageScheduler />} />
      </Routes>
    </Router>
  );
}

export default App;
