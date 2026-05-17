import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ngjarjet from './pages/Ngjarjet';
import NgjarjaForm from './pages/NgjarjaForm';
import Biletat from './pages/Biletat';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Artistet from './components/Artistet';
import Ekspozitat from './components/Ekspozitat';
import VepratArtit from './components/VepratArtit';
import PublicArtistet from './components/PublicArtistet';
import PublicVepratArtit from './components/PublicVepratArtit';
import Sallat from './pages/Sallat';
import Punetoret from './pages/Punetoret';
import Sponsoret from './pages/Sponsoret';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Duke ngarkuar...</div>;

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/artistet-public" element={<PublicArtistet />} />
    
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          <Route path="/artistet" element={
  <PrivateRoute><Artistet /></PrivateRoute>
} />

<Route path="/ekspozitat" element={
  <PrivateRoute><Ekspozitat /></PrivateRoute>
} />

<Route path="/veprat-artit" element={
  <PrivateRoute><VepratArtit /></PrivateRoute>
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

          <Route path="/sallat" element={<PrivateRoute><Sallat /></PrivateRoute>} />
          <Route path="/punetoret" element={<PrivateRoute><Punetoret /></PrivateRoute>} />
          <Route path="/sponsoret" element={<PrivateRoute><Sponsoret /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;