import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pjesemarresApi } from '../api/workshopApi';

const empty = { emri: '', mbiemri: '', email: '', telefoni: '' };

export default function PjesemarresForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (isEdit) loadPjesemarres(); }, [id]);

  const loadPjesemarres = async () => {
    try {
      const res = await pjesemarresApi.getById(id);
      setForm(res.data);
    } catch {
      setError('Pjesëmarrësi nuk u gjet.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await pjesemarresApi.update(id, { ...form, id: parseInt(id) });
      } else {
        await pjesemarresApi.create(form);
      }
      navigate('/pjesemarresit');
    } catch (err) {
      setError(err.response?.data || 'Gabim gjatë ruajtjes.');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>QendraKulturore</div>
        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button style={styles.navBtn} onClick={() => navigate('/workshopet')}>Workshopet</button>
          <button style={styles.navActive} onClick={() => navigate('/pjesemarresit')}>Pjesemarresit</button>
          <button style={styles.navBtn} onClick={() => navigate('/regjistrimet')}>Regjistrimet</button>
        </nav>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>{isEdit ? 'Ndrysho Pjesëmarrësin' : 'Shto Pjesëmarrës të Ri'}</h1>
          <button style={styles.backBtn} onClick={() => navigate('/pjesemarresit')}>← Kthehu</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid2}>
            <Field label="Emri *">
              <input style={styles.input} value={form.emri} onChange={f('emri')} required />
            </Field>
            <Field label="Mbiemri *">
              <input style={styles.input} value={form.mbiemri} onChange={f('mbiemri')} required />
            </Field>
          </div>
          <div style={styles.grid2}>
            <Field label="Email *">
              <input style={styles.input} type="email" value={form.email} onChange={f('email')} required />
            </Field>
            <Field label="Telefoni">
              <input style={styles.input} value={form.telefoni} onChange={f('telefoni')} />
            </Field>
          </div>

          <div style={styles.formFooter}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/pjesemarresit')}>Anulo</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Duke ruajtur...' : (isEdit ? 'Ruaj Ndryshimet' : 'Krijo Pjesëmarrësin')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  page:       { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  sidebar:    { width: 220, background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '24px 0' },
  logo:       { color: '#c8a96e', fontWeight: 700, fontSize: 16, padding: '0 24px 32px' },
  nav:        { display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 },
  navBtn:     { background: 'none', border: 'none', color: '#888', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14 },
  navActive:  { background: '#1a1a1a', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  main:       { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle:  { color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 },
  backBtn:    { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14 },
  error:      { background: '#2d0000', border: '1px solid #f44336', color: '#f44336', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14 },
  form:       { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: 32 },
  grid2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  input:      { width: '100%', background: '#111', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, boxSizing: 'border-box' },
  formFooter: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelBtn:  { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 14 },
  submitBtn:  { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};