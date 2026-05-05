import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ngjarjet from './pages/Ngjarjet';
import NgjarjaForm from './pages/NgjarjaForm';
import Biletat from './pages/Biletat';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Duke ngarkuar...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  console.log(import.meta.env.VITE_API_URL)
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/home" element={<Home />} />

          {/* USER AUTH */}
          <Route path="/login" element={<Login />} />

          {/* ADMIN ROUTES */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/ngjarjet" element={
            <PrivateRoute><Ngjarjet /></PrivateRoute>
          } />
          <Route path="/ngjarjet/create" element={
            <PrivateRoute><NgjarjaForm /></PrivateRoute>
          } />
          <Route path="/ngjarjet/:id" element={
            <PrivateRoute><NgjarjaForm /></PrivateRoute>
          } />
          <Route path="/biletat" element={
            <PrivateRoute><Biletat /></PrivateRoute>
          } />

          {/* DEFAULT → public homepage */}
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;