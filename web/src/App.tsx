import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cliente from './pages/Cliente';
import Header from './components/Header';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route
          path="/cliente"
          element={
            <PrivateRoute>
              <>
                <Header />
                <Cliente />
              </>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/cliente" replace />} />
        <Route path="*" element={<Navigate to="/cliente" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
