import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workshopApi } from '../api/workshopApi';

export default function WorkshopetInline() {
  const navigate = useNavigate();
  const [workshopet, setWorkshopet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatusi, setFilterStatusi] = useState('');

  useEffect(() => { loadWorkshopet(); }, []);

  const loadWorkshopet = async () => {
    try {
      const res = await workshopApi.getAll();
      setWorkshopet(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt që doni ta fshini këtë workshop?')) return;
    try {
      await workshopApi.delete(id);
      setWorkshopet(workshopet.filter(w => w.id !== id));
    } catch {
      alert('Gabim gjatë fshirjes.');
    }
  };

  const filtered = workshopet.filter(w => {
    const matchSearch = w.titulli?.toLowerCase().includes(search.toLowerCase());
    const matchStatusi = filterStatusi === '' || w.statusi === filterStatusi;
    return matchSearch && matchStatusi;
  });

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Workshopet</h1>
        <button style={styles.addBtn} onClick={() => navigate('/workshopet/create')}>+ Shto Workshop</button>
      </div>

      <div style={styles.filters}>
        <input style={styles.search} placeholder="Kërko workshop..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.select} value={filterStatusi} onChange={e => setFilterStatusi(e.target.value)}>
          <option value="">Të gjitha</option>
          <option>Planifikuar</option>
          <option>Aktiv</option>
          <option>Perfunduar</option>
          <option>Anuluar</option>
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
                <th style={styles.th}>Data Fillimit</th>
                <th style={styles.th}>Data Perfundimit</th>
                <th style={styles.th}>Kapaciteti</th>
                <th style={styles.th}>Statusi</th>
                <th style={styles.th}>Çmimi</th>
                <th style={styles.th}>Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id} style={styles.tr}>
                  <td style={styles.td}>{w.titulli}</td>
                  <td style={styles.td}>{new Date(w.dataFillimit).toLocaleDateString('sq-AL')}</td>
                  <td style={styles.td}>{new Date(w.dataPerfundimit).toLocaleDateString('sq-AL')}</td>
                  <td style={styles.td}>{w.kapaciteti}</td>
                  <td style={styles.td}><StatusBadge status={w.statusi} /></td>
                  <td style={styles.td}>€{w.cmimi?.toLocaleString()}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.editBtn} onClick={() => navigate(`/workshopet/${w.id}`)}>Ndrysho</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(w.id)}>Fshi</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={styles.empty}>Nuk u gjetën workshop.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
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
};