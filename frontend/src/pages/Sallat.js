import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function Sallat() {
  const navigate = useNavigate();
  const [sallat, setSallat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatusi, setFilterStatusi] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    emri: '',
    kati: '',
    pajisjet: '',
    statusi: 'E Lirë',
    pershkrimi: ''
  });

  useEffect(() => { loadSallat(); }, []);

  const loadSallat = async () => {
    try {
      const res = await apiClient.get('/Sallat');
      setSallat(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiClient.put(`/Sallat/${currentId}`, { id: currentId, ...formData, kati: parseInt(formData.kati) });
        alert('Salla u modifikua me sukses!');
      } else {
        await apiClient.post('/Sallat', { ...formData, kati: parseInt(formData.kati) });
        alert('Salla u shtua me sukses!');
      }
      closeModal();
      loadSallat();
    } catch (err) {
      console.error(err);
      alert('Ndodhi një gabim gjatë ruajtjes.');
    }
  };

  const handleEdit = (salla) => {
    setIsEditing(true);
    setCurrentId(salla.id);
    setFormData({
      emri: salla.emri,
      kati: salla.kati.toString(),
      pajisjet: salla.pajisjet || '',
      statusi: salla.statusi || 'E Lirë',
      pershkrimi: salla.pershkrimi || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('A jeni i sigurt që doni ta fshini këtë sallë?')) return;
    try {
      await apiClient.delete(`/Sallat/${id}`);
      setSallat(sallat.filter(s => s.id !== id));
    } catch {
      alert('Gabim gjatë fshirjes së sallës.');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ emri: '', kati: '', pajisjet: '', statusi: 'E Lirë', pershkrimi: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filtered = sallat.filter(s => {
    const matchSearch = s.emri?.toLowerCase().includes(search.toLowerCase());
    const matchStatusi = filterStatusi === '' || s.statusi === filterStatusi;
    return matchSearch && matchStatusi;
  });

  return (
    <div style={styles.page}>
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Sallat & Ambientet</h1>
          <button style={styles.addBtn} onClick={openAddModal}>
            + Shto Sallë
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            style={styles.search}
            placeholder="Kërko sallë sipas emrit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={styles.select}
            value={filterStatusi}
            onChange={e => setFilterStatusi(e.target.value)}
          >
            <option value="">Të gjitha statuset</option>
            <option value="E Lirë">E Lirë</option>
            <option value="E Zënë">E Zënë</option>
            <option value="Në Renovim">Në Renovim</option>
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
                  <th style={styles.th}>Emri</th>
                  <th style={styles.th}>Kati</th>
                  <th style={styles.th}>Pajisjet</th>
                  <th style={styles.th}>Statusi</th>
                  <th style={styles.th}>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>#{s.id}</td>
                    <td style={styles.td}>{s.emri}</td>
                    <td style={styles.td}>Kati {s.kati}</td>
                    <td style={styles.td}>{s.pajisjet || 'Nuk ka pajisje'}</td>
                    <td style={styles.td}><StatusBadge status={s.statusi} /></td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.editBtn} onClick={() => handleEdit(s)}>Ndrysho</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(s.id)}>Fshi</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={styles.empty}>Nuk u gjetën salla të regjistruara.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>{isEditing ? '📝 Modifiko Sallën' : '✨ Shto Sallë të Re'}</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Emri i Sallës *</label>
                <input type="text" name="emri" required style={styles.inputModal} value={formData.emri} onChange={handleChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kati *</label>
                <input type="number" name="kati" required style={styles.inputModal} value={formData.kati} onChange={handleChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Statusi</label>
                <select name="statusi" style={styles.selectModal} value={formData.statusi} onChange={handleChange}>
                  <option value="E Lirë">E Lirë</option>
                  <option value="E Zënë">E Zënë</option>
                  <option value="Në Renovim">Në Renovim</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Pajisjet</label>
                <input type="text" name="pajisjet" placeholder="Projektor, Akustikë" style={styles.inputModal} value={formData.pajisjet} onChange={handleChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Përshkrimi</label>
                <textarea name="pershkrimi" style={styles.textareaModal} value={formData.pershkrimi} onChange={handleChange} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>Anulo</button>
                <button type="submit" style={styles.saveBtn}>Ruaj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    'E Lirë':     { bg: '#1a3a1a', color: '#4caf50' },
    'E Zënë':     { bg: '#3a1a1a', color: '#f44336' },
    'Në Renovim': { bg: '#3a321a', color: '#ffb300' },
  };
  const c = colors[status] || { bg: '#2a2a2a', color: '#888' };
  return (
    <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, display: 'inline-block' }}>
      {status}
    </span>
  );
}

const styles = {
  page:         { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  main:         { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle:    { color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 },
  addBtn:       { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  filters:      { display: 'flex', gap: 12, marginBottom: 24 },
  search:       { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: 280 },
  select:       { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14 },
  loading:      { color: '#888', textAlign: 'center', padding: 40 },
  tableWrap:    { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { borderBottom: '1px solid #333' },
  th:           { color: '#888', fontSize: 12, fontWeight: 600, padding: '12px 16px', textAlign: 'left', textTransform: 'uppercase' },
  tr:           { borderBottom: '1px solid #1f1f1f' },
  td:           { color: '#ddd', fontSize: 14, padding: '14px 16px' },
  empty:        { color: '#555', textAlign: 'center', padding: 40 },
  actions:      { display: 'flex', gap: 8 },
  editBtn:      { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
  deleteBtn:    { background: '#2d0000', color: '#f44336', border: '1px solid #f4433630', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard:    { background: '#151515', border: '1px solid #333', borderRadius: 12, padding: 24, width: 380 },
  modalTitle:   { color: '#fff', margin: '0 0 16px 0', fontSize: 18 },
  form:         { display: 'flex', flexDirection: 'column', gap: 12 },
  formGroup:    { display: 'flex', flexDirection: 'column', gap: 4 },
  label:        { color: '#888', fontSize: 12 },
  inputModal:   { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' },
  selectModal:  { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' },
  textareaModal:{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', minHeight: 60, resize: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  cancelBtn:    { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14 },
  saveBtn:      { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};