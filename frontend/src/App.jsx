
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import VaultPage from "./pages/VaultPage";
import SignupForm from "./components/SignupForm"; // Import SignupForm
import { AuthProvider } from "./context/AuthContext";
import { VaultProvider } from "./context/VaultContext";
import './App.css'
import { GlobalProvider } from "./context/GlobalContext";
const App = () => {
  return (
    <Router>
    <AuthProvider>
      <VaultProvider>
        <GlobalProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vault" element={<VaultPage />} />
              <Route path="/signup" element={<SignupForm />} />  {/* Use SignupForm here */}
            </Routes>
          </GlobalProvider>
      </VaultProvider>
    </AuthProvider>
    </Router>
  );
};

export default App;
