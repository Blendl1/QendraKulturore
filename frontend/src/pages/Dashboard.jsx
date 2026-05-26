import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ngjarjetApi } from '../api/ngjarjetApi';
import { biletatApi } from '../api/biletatApi';
import { workshopApi, pjesemarresApi, regjistrimApi } from '../api/workshopApi';
import Artistet from '../components/Artistet';
import Ekspozitat from '../components/Ekspozitat';
import VepratArtit from '../components/VepratArtit';
import Sallat from './Sallat';
import Punetoret from './Punetoret';
import Sponsoret from './Sponsoret';
import Sallat from './Sallat';
import Punetoret from './Punetoret';
import Sponsoret from './Sponsoret';
import Workshopet from './Workshopet';
import Pjesemarresit from './Pjesemarresit';
import Regjistrimet from './Regjistrimet';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [ngjarjet, setNgjarjet] = useState([]);
  const [biletat, setBiletat] = useState([]);
  const [punetoret, setPunetoret] = useState([]);
  const [sponsoret, setSponsoret] = useState([]);
  const [workshopet, setWorkshopet] = useState([]);
  const [pjesemarresit, setPjesemarresit] = useState([]);
  const [regjistrimet, setRegjistrimet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [n, b, w, p, r] = await Promise.all([
        ngjarjetApi.getAll(),
        biletatApi.getAll(),
        workshopApi.getAll(),
        pjesemarresApi.getAll(),
        regjistrimApi.getAll(),
      ]);
      setNgjarjet(n.data);
      setBiletat(b.data);
      setWorkshopet(w.data);
      setPjesemarresit(p.data);
      setRegjistrimet(r.data);

      fetch('http://localhost:5002/api/punetoret', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then(res => res.json()).then(data => setPunetoret(data)).catch(() => {});

      fetch('http://localhost:5002/api/sponzoret', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then(res => res.json()).then(data => setSponsoret(data)).catch(() => {});

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

  const totalRevenue       = biletat.reduce((sum, b) => sum + (b.cmimi || 0), 0);
  const totalAttendees     = biletat.length;
  const activeEvents       = ngjarjet.filter(n => n.statusi === 'Aktiv').length;
  const totalEvents        = ngjarjet.length;
  const totalWorkshopet    = workshopet.length;
  const activeWorkshopet   = workshopet.filter(w => w.statusi === 'Aktiv').length;
  const totalPjesemarresit = pjesemarresit.length;
  const totalRegjistrimet  = regjistrimet.length;

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>QendraKulturore</div>
        <nav style={styles.nav}>
          <button style={activePage === 'dashboard' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('dashboard')}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate('/ngjarjet')}>Ngjarjet</button>
          <button style={styles.navBtn} onClick={() => navigate('/biletat')}>Biletat</button>
          <div style={styles.navDivider} />
          <button style={activePage === 'artistet' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('artistet')}>Artistët</button>
          <button style={activePage === 'ekspozitat' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('ekspozitat')}>Ekspozitat</button>
          <button style={activePage === 'veprat' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('veprat')}>Veprat e Artit</button>
          <div style={styles.navDivider} />
          <button style={activePage === 'workshopet' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('workshopet')}>Workshopet</button>
          <button style={activePage === 'pjesemarresit' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('pjesemarresit')}>Pjesëmarrësit</button>
          <button style={activePage === 'regjistrimet' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('regjistrimet')}>Regjistrimet</button>
          <div style={styles.navDivider} />
          <button style={activePage === 'sallat' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('sallat')}>Sallat</button>
          <button style={activePage === 'punetoret' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('punetoret')}>Punëtorët</button>
          <button style={activePage === 'sponsoret' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('sponsoret')}>Sponsorët</button>
          <div style={styles.navDivider} />
          <button style={activePage === 'users' ? styles.navActive : styles.navBtn} onClick={() => setActivePage('users')}>Përdoruesit</button>
          <div style={styles.navDivider} />

          <button
            style={activePage === 'sallat' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('sallat')}
          >Sallat</button>

          <button
            style={activePage === 'punetoret' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('punetoret')}
          >Punëtorët</button>

          <button
            style={activePage === 'sponsoret' ? styles.navActive : styles.navBtn}
            onClick={() => setActivePage('sponsoret')}
          >Sponsorët</button>

        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>Çkyçu</button>
      </div>

      <div style={styles.main}>
        {activePage === 'artistet'      && <Artistet />}
        {activePage === 'ekspozitat'    && <Ekspozitat />}
        {activePage === 'veprat'        && <VepratArtit />}
        {activePage === 'workshopet'    && <Workshopet />}
        {activePage === 'pjesemarresit' && <Pjesemarresit />}
        {activePage === 'regjistrimet'  && <Regjistrimet />}
        {activePage === 'users'         && <UsersList />}
        {activePage === 'sallat'        && <Sallat />}
        {activePage === 'punetoret'     && <Punetoret />}
        {activePage === 'sponsoret'     && <Sponsoret />}

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
                  <MetricCard label="Ngjarje Gjithsej"    value={totalEvents}        color="#c8a96e" />
                  <MetricCard label="Ngjarje Aktive"       value={activeEvents}       color="#4caf50" />
                  <MetricCard label="Bileta të Shitura"    value={totalAttendees}     color="#2196f3" />
                  <MetricCard label="Të Ardhura (€)"       value={`€${totalRevenue.toLocaleString()}`} color="#9c27b0" />
                  <MetricCard label="Workshopet Gjithsej"  value={totalWorkshopet}    color="#c8a96e" />
                  <MetricCard label="Workshopet Aktive"    value={activeWorkshopet}   color="#4caf50" />
                  <MetricCard label="Pjesëmarrësit"        value={totalPjesemarresit} color="#2196f3" />
                  <MetricCard label="Regjistrimet"         value={totalRegjistrimet}  color="#ff9800" />
                </div>

                <div style={{...styles.grid4, gridTemplateColumns: 'repeat(2, 1fr)'}}>
                  <MetricCard label="Punëtorët Gjithsej" value={punetoret.length} color="#ff9800" />
                  <MetricCard label="Sponsorët Gjithsej" value={sponsoret.length} color="#00bcd4" />
                </div>

                <div style={{...styles.grid4, gridTemplateColumns: 'repeat(2, 1fr)'}}>
                  <MetricCard label="Punëtorët Gjithsej" value={punetoret.length} color="#ff9800" />
                  <MetricCard label="Sponsorët Gjithsej" value={sponsoret.length} color="#00bcd4" />
                </div>

                <div style={styles.section}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Ngjarjet e Fundit</h2>
                    <button style={styles.addBtn} onClick={() => navigate('/ngjarjet/create')}>+ Shto Ngjarje</button>
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
                            <button style={styles.editBtn} onClick={() => navigate(`/ngjarjet/${n.id}`)}>Detajet</button>
                          </td>
                        </tr>
                      ))}
                      {ngjarjet.length === 0 && (
                        <tr><td colSpan={6} style={styles.empty}>Nuk ka ngjarje ende.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ ...styles.section, marginTop: 24 }}>
                  <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Workshopet e Fundit</h2>
                    <button style={styles.addBtn} onClick={() => setActivePage('workshopet')}>+ Shto Workshop</button>
                  </div>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thead}>
                        <th style={styles.th}>Titulli</th>
                        <th style={styles.th}>Data</th>
                        <th style={styles.th}>Kapaciteti</th>
                        <th style={styles.th}>Statusi</th>
                        <th style={styles.th}>Çmimi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workshopet.slice(0, 5).map(w => (
                        <tr key={w.id} style={styles.tr}>
                          <td style={styles.td}>{w.titulli}</td>
                          <td style={styles.td}>{new Date(w.dataFillimit).toLocaleDateString('sq-AL')}</td>
                          <td style={styles.td}>{w.kapaciteti}</td>
                          <td style={styles.td}><StatusBadge status={w.statusi} /></td>
                          <td style={styles.td}>€{w.cmimi?.toLocaleString()}</td>
                        </tr>
                      ))}
                      {workshopet.length === 0 && (
                        <tr><td colSpan={5} style={styles.empty}>Nuk ka workshop ende.</td></tr>
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
    Perfunduar:  { bg: '#2a2a2a', color: '#888' },
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
};

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', email: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('accessToken');
  const apiBase = `${process.env.REACT_APP_API_URL}/api/Users`;

  const loadUsers = () => {
    fetch(apiBase, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt që doni ta fshini këtë përdorues?')) return;
    await fetch(`${apiBase}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setMessage('Përdoruesi u fshi.');
    loadUsers();
  };

  const handleRoleChange = async (id, currentRoles) => {
    const newRole = currentRoles.includes('Admin') ? 'User' : 'Admin';
    await fetch(`${apiBase}/${id}/role`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    setMessage(`Roli u ndryshua në ${newRole}.`);
    loadUsers();
  };

  const handleEditOpen = (u) => {
    setEditUser(u.id);
    setEditForm({ fullName: u.fullName, email: u.email });
  };

  const handleEditSave = async () => {
    await fetch(`${apiBase}/${editUser}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: editForm.fullName, email: editForm.email })
    });
    setEditUser(null);
    setMessage('Përdoruesi u përditësua.');
    loadUsers();
  };

  if (loading) return <div style={{ color: '#888', padding: 40 }}>Duke ngarkuar...</div>;

  return (
    <div style={styles.section}>
      <h2 style={{ color: '#fff', marginBottom: 8 }}>Përdoruesit</h2>
      {message && (
        <div style={{ color: '#4caf50', marginBottom: 16, fontSize: 13 }}>{message}</div>
      )}
      {editUser && (
        <div style={uStyles.modal}>
          <div style={uStyles.modalCard}>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>Ndrysho Përdoruesin</h3>
            <label style={uStyles.label}>Emri i plotë</label>
            <input style={uStyles.input} value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
            <label style={uStyles.label}>Email</label>
            <input style={uStyles.input} value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button style={uStyles.saveBtn} onClick={handleEditSave}>Ruaj</button>
              <button style={uStyles.cancelBtn} onClick={() => setEditUser(null)}>Anulo</button>
            </div>
          </div>
        </div>
      )}
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Emri</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Roli</th>
            <th style={styles.th}>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={styles.tr}>
              <td style={styles.td}>{u.fullName}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.roles?.join(', ')}</td>
              <td style={styles.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={uStyles.editBtn} onClick={() => handleEditOpen(u)}>Ndrysho</button>
                  <button style={uStyles.roleBtn} onClick={() => handleRoleChange(u.id, u.roles)}>{u.roles?.includes('Admin') ? 'Bëj User' : 'Bëj Admin'}</button>
                  <button style={uStyles.deleteBtn} onClick={() => handleDelete(u.id)}>Fshi</button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={4} style={styles.empty}>Nuk ka përdorues.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const uStyles = {
  editBtn:   { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
  roleBtn:   { background: '#1a1a3a', color: '#2196f3', border: '1px solid #2196f3', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
  deleteBtn: { background: '#3a1a1a', color: '#f44336', border: '1px solid #f44336', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 },
  modal:     { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 32, width: 400, display: 'flex', flexDirection: 'column', gap: 8 },
  label:     { color: '#888', fontSize: 13 },
  input:     { background: '#111', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 },
  saveBtn:   { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  cancelBtn: { background: 'none', color: '#888', border: '1px solid #333', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 14 },
};