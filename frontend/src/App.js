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
import Register from './pages/Register';
import Workshopet from './pages/Workshopet';
import WorkshopForm from './pages/WorkshopForm';
import Pjesemarresit from './pages/Pjesemarresit';
import PjesemarresForm from './pages/PjesemarresForm';
import Regjistrimet from './pages/Regjistrimet';
import RegjistrimForm from './pages/RegjistrimForm';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Duke ngarkuar...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Duke ngarkuar...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!user.roles?.includes('Admin')) return <Navigate to="/home" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/artistet-public" element={<PublicArtistet />} />

          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/artistet" element={<PrivateRoute><Artistet /></PrivateRoute>} />
          <Route path="/ekspozitat" element={<PrivateRoute><Ekspozitat /></PrivateRoute>} />
          <Route path="/veprat-artit" element={<PrivateRoute><VepratArtit /></PrivateRoute>} />
          <Route path="/ngjarjet" element={<PrivateRoute><Ngjarjet /></PrivateRoute>} />
          <Route path="/ngjarjet/create" element={<PrivateRoute><NgjarjaForm /></PrivateRoute>} />
          <Route path="/ngjarjet/:id" element={<PrivateRoute><NgjarjaForm /></PrivateRoute>} />
          <Route path="/biletat" element={<PrivateRoute><Biletat /></PrivateRoute>} />

          <Route path="/workshopet" element={<PrivateRoute><Workshopet /></PrivateRoute>} />
          <Route path="/workshopet/create" element={<PrivateRoute><WorkshopForm /></PrivateRoute>} />
          <Route path="/workshopet/:id" element={<PrivateRoute><WorkshopForm /></PrivateRoute>} />
          <Route path="/pjesemarresit" element={<PrivateRoute><Pjesemarresit /></PrivateRoute>} />
          <Route path="/pjesemarresit/create" element={<PrivateRoute><PjesemarresForm /></PrivateRoute>} />
          <Route path="/pjesemarresit/:id" element={<PrivateRoute><PjesemarresForm /></PrivateRoute>} />
          <Route path="/regjistrimet" element={<PrivateRoute><Regjistrimet /></PrivateRoute>} />
          <Route path="/regjistrimet/create" element={<PrivateRoute><RegjistrimForm /></PrivateRoute>} />
          <Route path="/regjistrimet/:id" element={<PrivateRoute><RegjistrimForm /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;