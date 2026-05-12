import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngjarjetApi } from '../api/ngjarjetApi';

export default function Ngjarjet() {
  const navigate = useNavigate();
  const [ngjarjet, setNgjarjet] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterLloji, setFilterLloji] = useState('');

  useEffect(() => { loadNgjarjet(); }, []);

  const loadNgjarjet = async () => {
    try {
      const res = await ngjarjetApi.getAll();
      setNgjarjet(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt që doni ta fshini këtë ngjarje?')) return;
    try {
      await ngjarjetApi.delete(id);
      setNgjarjet(ngjarjet.filter(n => n.id !== id));
    } catch {
      alert('Gabim gjatë fshirjes.');
    }
  };

  const filtered = ngjarjet.filter(n => {
    const matchSearch = n.titulli?.toLowerCase().includes(search.toLowerCase());
    const matchLloji  = filterLloji === '' || n.lloji === filterLloji;
    return matchSearch && matchLloji;
  });

  const llojet = [...new Set(ngjarjet.map(n => n.lloji).filter(Boolean))];

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>QendraKulturore</div>
        <nav style={styles.nav}>
  <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
  <button style={styles.navActive}>Ngjarjet</button>
  <button style={styles.navBtn} onClick={() => navigate('/biletat')}>Biletat</button>
  <div style={styles.navDivider} />
  <button style={styles.navBtn} onClick={() => navigate('/dashboard?page=artistet')}>Artistët</button>
  <button style={styles.navBtn} onClick={() => navigate('/dashboard?page=ekspozitat')}>Ekspozitat</button>
  <button style={styles.navBtn} onClick={() => navigate('/dashboard?page=veprat')}>Veprat e Artit</button>
</nav>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Ngjarjet</h1>
          <button style={styles.addBtn} onClick={() => navigate('/ngjarjet/create')}>
            + Shto Ngjarje
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            style={styles.search}
            placeholder="Kërko ngjarje..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={styles.select}
            value={filterLloji}
            onChange={e => setFilterLloji(e.target.value)}
          >
            <option value="">Të gjitha llojet</option>
            {llojet.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={styles.loading}>Duke ngarkuar...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Titulli</th>
                  <th style={styles.th}>Lloji</th>
                  <th style={styles.th}>Data Fillimit</th>
                  <th style={styles.th}>Data Perfundimit</th>
                  <th style={styles.th}>Statusi</th>
                  <th style={styles.th}>Çmimi</th>
                  <th style={styles.th}>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(n => (
                  <tr key={n.id} style={styles.tr}>
                    <td style={styles.td}>{n.titulli}</td>
                    <td style={styles.td}>{n.lloji}</td>
                    <td style={styles.td}>
                      {new Date(n.dataFillimit).toLocaleDateString('sq-AL')}
                    </td>
                    <td style={styles.td}>
                      {new Date(n.dataPerfundimit).toLocaleDateString('sq-AL')}
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={n.statusi} />
                    </td>
                    <td style={styles.td}>€{n.cmimiBiletes?.toLocaleString()}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={styles.editBtn}
                          onClick={() => navigate(`/ngjarjet/${n.id}`)}
                        >
                          Ndrysho
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(n.id)}
                        >
                          Fshi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={styles.empty}>
                      Nuk u gjetën ngjarje.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
    <span style={{
      background: c.bg, color: c.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 500,
    }}>
      {status}
    </span>
  );
}

const styles = {
  page:      { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  sidebar:   { width: 220, background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '24px 0' },
  logo:      { color: '#c8a96e', fontWeight: 700, fontSize: 16, padding: '0 24px 32px' },
  nav:       { display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 },
  navBtn:    { background: 'none', border: 'none', color: '#888', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14 },
  navActive: { background: '#1a1a1a', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  main:      { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  header:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 },
  addBtn:    { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  filters:   { display: 'flex', gap: 12, marginBottom: 24 },
  search:    { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: 280 },
  select:    { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 },
  loading:   { color: '#888', textAlign: 'center', padding: 40 },
  tableWrap: { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' },
  table:     { width: '100%', borderCollapse: 'collapse' },
  thead:     { borderBottom: '1px solid #333' },
  th:        { color: '#888', fontSize: 12, fontWeight: 600, padding: '12px 16px', textAlign: 'left', textTransform: 'uppercase' },
  tr:        { borderBottom: '1px solid #1f1f1f' },
  td:        { color: '#ddd', fontSize: 14, padding: '14px 16px' },
  empty:     { color: '#555', textAlign: 'center', padding: 40 },
  actions:   { display: 'flex', gap: 8 },
  editBtn:   { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
  deleteBtn: { background: '#2d0000', color: '#f44336', border: '1px solid #f4433630', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
  navDivider: { borderTop: '1px solid #222', margin: '8px 0' },
};