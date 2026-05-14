import { useState } from 'react';
import DeliveryPredictor from './components/DeliveryPredictor'; // Adjust path if needed
import AuthPage from './pages/AuthPage'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // New function to handle logging out
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        // Pass the logout function into your dashboard
        <DeliveryPredictor onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;