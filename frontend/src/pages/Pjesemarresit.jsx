import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pjesemarresApi } from '../api/workshopApi';

export default function Pjesemarresit() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadLista(); }, []);

  const loadLista = async () => {
    try {
      const res = await pjesemarresApi.getAll();
      setLista(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt?')) return;
    try {
      await pjesemarresApi.delete(id);
      setLista(lista.filter(p => p.id !== id));
    } catch {
      alert('Gabim gjatë fshirjes.');
    }
  };

  const filtered = lista.filter(p =>
    `${p.emri} ${p.mbiemri} ${p.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>QendraKulturore</div>
        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate('/workshopet')}>Workshopet</button>
          <button style={styles.navActive}>Pjesemarresit</button>
          <button style={styles.navBtn} onClick={() => navigate('/regjistrimet')}>Regjistrimet</button>
        </nav>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Pjesëmarrësit</h1>
          <button style={styles.addBtn} onClick={() => navigate('/pjesemarresit/create')}>
            + Shto Pjesëmarrës
          </button>
        </div>

        <div style={styles.filters}>
          <input
            style={styles.search}
            placeholder="Kërko pjesëmarrës..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={styles.loading}>Duke ngarkuar...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Emri</th>
                  <th style={styles.th}>Mbiemri</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Telefoni</th>
                  <th style={styles.th}>Data Regjistrimit</th>
                  <th style={styles.th}>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.emri}</td>
                    <td style={styles.td}>{p.mbiemri}</td>
                    <td style={styles.td}>{p.email}</td>
                    <td style={styles.td}>{p.telefoni}</td>
                    <td style={styles.td}>{new Date(p.dataRegjistrimit).toLocaleDateString('sq-AL')}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.editBtn} onClick={() => navigate(`/pjesemarresit/${p.id}`)}>Ndrysho</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Fshi</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={styles.empty}>Nuk u gjetën pjesëmarrës.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
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
};