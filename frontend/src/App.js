import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Artistet from './components/Artistet';
import VepratArtit from './components/VepratArtit';
import Ekspozitat from './components/Ekspozitat';
import './App.css';

function App() {
  const [stats, setStats] = useState({ totalValue: 0, totalCount: 0 });

  useEffect(() => {
    const fetchStats = () => {
      fetch('http://localhost:5002/api/VepratArtit/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.log("Backend nuk po përgjigjet ende..."));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <nav>
        <Link to="/veprat">Veprat e Artit</Link>
        <Link to="/">Artistët</Link>
        <Link to="/ekspozitat">Ekspozitat</Link>
      </nav>

      <div className="dashboard-widget">
        <div className="stat-item">
          <strong>Vlera Totale</strong>
          <span>{stats.totalValue} €</span>
        </div>
        <div className="stat-item">
          <strong>Numri i Veprave</strong>
          <span>{stats.totalCount}</span>
        </div>
      </div>

      <Routes>
        <Route path="/veprat" element={<VepratArtit />} />
        <Route path="/" element={<Artistet />} />
        <Route path="/ekspozitat" element={<Ekspozitat />} />
      </Routes>
    </Router>
  );
}

export default App;