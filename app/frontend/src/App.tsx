import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Chat from "./components/Chat";

function App() {
  // Initialize routes
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/chat" />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
