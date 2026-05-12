import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ngjarjetApi } from '../api/ngjarjetApi';
import { biletatApi } from '../api/biletatApi';
import Artistet from '../components/Artistet';
import Ekspozitat from '../components/Ekspozitat';
import VepratArtit from '../components/VepratArtit';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ngjarjet, setNgjarjet] = useState([]);
  const [biletat, setBiletat]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [n, b] = await Promise.all([
        ngjarjetApi.getAll(),
        biletatApi.getAll(),
      ]);
      setNgjarjet(n.data);
      setBiletat(b.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalRevenue   = biletat.reduce((sum, b) => sum + (b.cmimi || 0), 0);
  const totalAttendees = biletat.length;
  const activeEvents   = ngjarjet.filter(n => n.statusi === 'Aktiv').length;
  const totalEvents    = ngjarjet.length;

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>QendraKulturore</div>
        <nav style={styles.nav}>

          <button
            style={activePage === 'dashboard' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('dashboard')}
          >Dashboard</button>

          <button
            style={styles.navBtn}
            onClick={() => navigate('/ngjarjet')}
          >Ngjarjet</button>

          <button
            style={styles.navBtn}
            onClick={() => navigate('/biletat')}
          >Biletat</button>

          <div style={styles.navDivider} />

          <button
            style={activePage === 'artistet' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('artistet')}
          >Artistët</button>

          <button
            style={activePage === 'ekspozitat' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('ekspozitat')}
          >Ekspozitat</button>

          <button
            style={activePage === 'veprat' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('veprat')}
          >Veprat e Artit</button>

        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Çkyçu</button>
      </div>

      {/* Main content */}
      <div style={styles.main}>

        {/* CRUD pages */}
        {activePage === 'artistet'   && <Artistet />}
        {activePage === 'ekspozitat' && <Ekspozitat />}
        {activePage === 'veprat'     && <VepratArtit />}

        {/* Dashboard page */}
        {activePage === 'dashboard' && (
          <>
            <div style={styles.header}>
              <h1 style={styles.pageTitle}>Dashboard</h1>
              <span style={styles.welcome}>Mirë se vjen, {user?.fullName || 'Admin'}</span>
            </div>

            {loading ? (
              <div style={styles.loading}>Duke ngarkuar...</div>
            ) : (
              <>
                <div style={styles.grid4}>
                  <MetricCard label="Ngjarje Gjithsej"  value={totalEvents}    color="#c8a96e" />
                  <MetricCard label="Ngjarje Aktive"     value={activeEvents}   color="#4caf50" />
                  <MetricCard label="Bileta të Shitura"  value={totalAttendees} color="#2196f3" />
                  <MetricCard label="Të Ardhura (€)"     value={`€${totalRevenue.toLocaleString()}`} color="#9c27b0" />
                </div>

                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Ngjarjet e Fundit</h2>
                    <button style={styles.addBtn} onClick={() => navigate('/ngjarjet/create')}>
                      + Shto Ngjarje
                    </button>
                  </div>

                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thead}>
                        <th style={styles.th}>Titulli</th>
                        <th style={styles.th}>Lloji</th>
                        <th style={styles.th}>Data</th>
                        <th style={styles.th}>Statusi</th>
                        <th style={styles.th}>Çmimi</th>
                        <th style={styles.th}>Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ngjarjet.slice(0, 5).map(n => (
                        <tr key={n.id} style={styles.tr}>
                          <td style={styles.td}>{n.titulli}</td>
                          <td style={styles.td}>{n.lloji}</td>
                          <td style={styles.td}>{new Date(n.dataFillimit).toLocaleDateString('sq-AL')}</td>
                          <td style={styles.td}><StatusBadge status={n.statusi} /></td>
                          <td style={styles.td}>€{n.cmimiBiletes?.toLocaleString()}</td>
                          <td style={styles.td}>
                            <button style={styles.editBtn} onClick={() => navigate(`/ngjarjet/${n.id}`)}>
                              Detajet
                            </button>
                          </td>
                        </tr>
                      ))}
                      {ngjarjet.length === 0 && (
                        <tr><td colSpan={6} style={styles.empty}>Nuk ka ngjarje ende.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Aktiv:       { bg: '#1a3a1a', color: '#4caf50' },
    Planifikuar: { bg: '#1a1a3a', color: '#2196f3' },
    Perfunduar:  { bg: '#2a2a2a', color: '#888'    },
    Anuluar:     { bg: '#3a1a1a', color: '#f44336' },
  };
  const c = colors[status] || colors.Planifikuar;
  return (
    <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
      {status}
    </span>
  );
}

const styles = {
  page:         { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  sidebar:      { width: 220, background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '24px 0' },
  logo:         { color: '#c8a96e', fontWeight: 700, fontSize: 16, padding: '0 24px 32px' },
  nav:          { display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 },
  navDivider:   { borderTop: '1px solid #222', margin: '8px 0' },
  navBtn:       { background: 'none', border: 'none', color: '#888', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14 },
  navActive:    { background: '#1a1a1a', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  logoutBtn:    { background: 'none', border: 'none', color: '#f44336', padding: '10px 24px', textAlign: 'left', cursor: 'pointer', fontSize: 14 },
  main:         { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  pageTitle:    { color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 },
  welcome:      { color: '#888', fontSize: 14 },
  loading:      { color: '#888', textAlign: 'center', padding: 40 },
  grid4:        { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 },
  card:         { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: '24px' },
  cardValue:    { fontSize: 32, fontWeight: 700, marginBottom: 8 },
  cardLabel:    { color: '#888', fontSize: 13 },
  section:      { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: 24 },
  sectionHeader:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 },
  addBtn:       { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { borderBottom: '1px solid #333' },
  th:           { color: '#888', fontSize: 12, fontWeight: 600, padding: '8px 12px', textAlign: 'left', textTransform: 'uppercase' },
  tr:           { borderBottom: '1px solid #1f1f1f' },
  td:           { color: '#ddd', fontSize: 14, padding: '12px' },
  empty:        { color: '#555', textAlign: 'center', padding: 32 },
  editBtn:      { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 },
  navDivider: { borderTop: '1px solid #222', margin: '8px 0' },
};