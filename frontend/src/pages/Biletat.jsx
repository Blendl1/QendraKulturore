import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { biletatApi } from '../api/biletatApi';
import { ngjarjetApi } from '../api/ngjarjetApi';

export default function Biletat() {
  const navigate = useNavigate();
  const [biletat, setBiletat]   = useState([]);
  const [ngjarjet, setNgjarjet] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterNgjarja, setFilterNgjarja] = useState('');
  const [filterStatusi, setFilterStatusi] = useState('');
  const [form, setForm] = useState({
    ngjarjaId: '', cmimi: '', lloji: 'Standard', statusi: 'Rezervuar',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [b, n] = await Promise.all([
        biletatApi.getAll(),
        ngjarjetApi.getAll(),
      ]);
      setBiletat(b.data);
      setNgjarjet(n.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await biletatApi.create({
        ...form,
        ngjarjaId: parseInt(form.ngjarjaId),
        cmimi: parseFloat(form.cmimi),
        dataBlerjes: new Date().toISOString(),
      });
      setShowForm(false);
      setForm({ ngjarjaId: '', cmimi: '', lloji: 'Standard', statusi: 'Rezervuar' });
      loadData();
    } catch {
      alert('Gabim gjatë krijimit të biletës.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt?')) return;
    try {
      await biletatApi.delete(id);
      setBiletat(biletat.filter(b => b.id !== id));
    } catch {
      alert('Gabim gjatë fshirjes.');
    }
  };

  const filtered = biletat.filter(b => {
    const matchNgjarja = filterNgjarja === '' ||
      String(b.ngjarjaId) === filterNgjarja;
    const matchStatusi = filterStatusi === '' || b.statusi === filterStatusi;
    return matchNgjarja && matchStatusi;
  });

  // Stats
  const totalRevenue  = filtered.reduce((s, b) => s + (b.cmimi || 0), 0);
  const reserved      = filtered.filter(b => b.statusi === 'Rezervuar').length;
  const confirmed     = filtered.filter(b => b.statusi === 'Konfirmuar').length;

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>QendraKulturore</div>
        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate('/ngjarjet')}>Ngjarjet</button>
          <button style={styles.navActive}>Biletat</button>
        </nav>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Biletat</h1>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Mbyll' : '+ Shto Biletë'}
          </button>
        </div>

        {/* Quick stats */}
        <div style={styles.statsRow}>
          <StatCard label="Gjithsej Bileta" value={filtered.length} />
          <StatCard label="Të Rezervuara"   value={reserved} color="#2196f3" />
          <StatCard label="Të Konfirmuara"  value={confirmed} color="#4caf50" />
          <StatCard label="Të Ardhura"
            value={`€${totalRevenue.toLocaleString()}`} color="#c8a96e" />
        </div>

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} style={styles.formCard}>
            <h3 style={styles.formTitle}>Biletë e Re</h3>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.label}>Ngjarja *</label>
                <select style={styles.input} required
                  value={form.ngjarjaId}
                  onChange={e => setForm({ ...form, ngjarjaId: e.target.value })}>
                  <option value="">Zgjidhni ngjarjen</option>
                  {ngjarjet.map(n => (
                    <option key={n.id} value={n.id}>{n.titulli}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Lloji</label>
                <select style={styles.input}
                  value={form.lloji}
                  onChange={e => setForm({ ...form, lloji: e.target.value })}>
                  <option>Standard</option>
                  <option>VIP</option>
                  <option>Student</option>
                  <option>Falas</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Çmimi (ALL)</label>
                <input style={styles.input} type="number" min="0"
                  value={form.cmimi}
                  onChange={e => setForm({ ...form, cmimi: e.target.value })} />
              </div>
              <div>
                <label style={styles.label}>Statusi</label>
                <select style={styles.input}
                  value={form.statusi}
                  onChange={e => setForm({ ...form, statusi: e.target.value })}>
                  <option>Rezervuar</option>
                  <option>Konfirmuar</option>
                  <option>Anuluar</option>
                </select>
              </div>
            </div>
            <div style={styles.formFooter}>
              <button type="button" style={styles.cancelBtn}
                onClick={() => setShowForm(false)}>Anulo</button>
              <button type="submit" style={styles.submitBtn}>Krijo Biletën</button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div style={styles.filters}>
          <select style={styles.select} value={filterNgjarja}
            onChange={e => setFilterNgjarja(e.target.value)}>
            <option value="">Të gjitha ngjarjet</option>
            {ngjarjet.map(n => (
              <option key={n.id} value={n.id}>{n.titulli}</option>
            ))}
          </select>
          <select style={styles.select} value={filterStatusi}
            onChange={e => setFilterStatusi(e.target.value)}>
            <option value="">Të gjitha statuset</option>
            <option>Rezervuar</option>
            <option>Konfirmuar</option>
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
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Ngjarja</th>
                  <th style={styles.th}>Lloji</th>
                  <th style={styles.th}>Çmimi</th>
                  <th style={styles.th}>Statusi</th>
                  <th style={styles.th}>Data Blerjes</th>
                  <th style={styles.th}>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => {
                  const ngjarja = ngjarjet.find(n => n.id === b.ngjarjaId);
                  return (
                    <tr key={b.id} style={styles.tr}>
                      <td style={styles.td}>#{b.id}</td>
                      <td style={styles.td}>{ngjarja?.titulli || '—'}</td>
                      <td style={styles.td}>{b.lloji}</td>
                      <td style={styles.td}>€{b.cmimi?.toLocaleString()}</td>
                      <td style={styles.td}>
                        <StatusBadge status={b.statusi} />
                      </td>
                      <td style={styles.td}>
                        {b.dataBlerjes
                          ? new Date(b.dataBlerjes).toLocaleDateString('sq-AL')
                          : '—'}
                      </td>
                      <td style={styles.td}>
                        <button style={styles.deleteBtn}
                          onClick={() => handleDelete(b.id)}>
                          Fshi
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={styles.empty}>
                      Nuk u gjetën bileta.
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

function StatCard({ label, value, color = '#fff' }) {
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, padding: '16px 20px' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Rezervuar:  { bg: '#1a1a3a', color: '#2196f3' },
    Konfirmuar: { bg: '#1a3a1a', color: '#4caf50' },
    Anuluar:    { bg: '#3a1a1a', color: '#f44336' },
  };
  const c = map[status] || map.Rezervuar;
  return (
    <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
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
  statsRow:  { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 },
  formCard:  { background: '#1a1a1a', border: '1px solid #333', borderRadius: 12, padding: 24, marginBottom: 24 },
  formTitle: { color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 20px' },
  formGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  label:     { display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 },
  input:     { width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box' },
  formFooter:{ display: 'flex', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontSize: 14 },
  submitBtn: { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  filters:   { display: 'flex', gap: 12, marginBottom: 20 },
  select:    { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 },
  loading:   { color: '#888', textAlign: 'center', padding: 40 },
  tableWrap: { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' },
  table:     { width: '100%', borderCollapse: 'collapse' },
  thead:     { borderBottom: '1px solid #333' },
  th:        { color: '#888', fontSize: 12, fontWeight: 600, padding: '12px 16px', textAlign: 'left', textTransform: 'uppercase' },
  tr:        { borderBottom: '1px solid #1f1f1f' },
  td:        { color: '#ddd', fontSize: 14, padding: '14px 16px' },
  empty:     { color: '#555', textAlign: 'center', padding: 40 },
  deleteBtn: { background: '#2d0000', color: '#f44336', border: '1px solid #f4433630', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
};