import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { regjistrimApi, workshopApi, pjesemarresApi } from '../api/workshopApi';

const empty = {
  workshopId: '', pjesemarresId: '',
  statusi: 'Aktiv', eshtePaguar: false,
};

export default function RegjistrimForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [workshopet, setWorkshopet] = useState([]);
  const [pjesemarresit, setPjesemarresit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDropdowns();
    if (isEdit) loadRegjistrim();
  }, [id]);

  const loadDropdowns = async () => {
    try {
      const [wRes, pRes] = await Promise.all([workshopApi.getAll(), pjesemarresApi.getAll()]);
      setWorkshopet(wRes.data);
      setPjesemarresit(pRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRegjistrim = async () => {
    try {
      const res = await regjistrimApi.getById(id);
      setForm(res.data);
    } catch {
      setError('Regjistrim nuk u gjet.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        workshopId: parseInt(form.workshopId),
        pjesemarresId: parseInt(form.pjesemarresId),
        eshtePaguar: form.eshtePaguar === true || form.eshtePaguar === 'true',
      };
      if (isEdit) {
        await regjistrimApi.update(id, { ...payload, id: parseInt(id) });
      } else {
        await regjistrimApi.create(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Gabim gjatë ruajtjes.');
    } finally {
      setLoading(false);
    }
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div style={styles.main}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>{isEdit ? 'Ndrysho Regjistrim' : 'Shto Regjistrim të Ri'}</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Kthehu</button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid2}>
          <Field label="Workshop *">
            <select style={styles.input} value={form.workshopId} onChange={f('workshopId')} required>
              <option value="">Zgjidhni workshop</option>
              {workshopet.map(w => (
                <option key={w.id} value={w.id}>{w.titulli}</option>
              ))}
            </select>
          </Field>
          <Field label="Pjesëmarrësi *">
            <select style={styles.input} value={form.pjesemarresId} onChange={f('pjesemarresId')} required>
              <option value="">Zgjidhni pjesëmarrësin</option>
              {pjesemarresit.map(p => (
                <option key={p.id} value={p.id}>{p.emri} {p.mbiemri}</option>
              ))}
            </select>
          </Field>
        </div>

        <div style={styles.grid2}>
          <Field label="Statusi">
            <select style={styles.input} value={form.statusi} onChange={f('statusi')}>
              <option>Aktiv</option>
              <option>Anuluar</option>
              <option>Perfunduar</option>
            </select>
          </Field>
          <Field label="Paguar">
            <select style={styles.input} value={form.eshtePaguar} onChange={f('eshtePaguar')}>
              <option value="false">Jo</option>
              <option value="true">Po</option>
            </select>
          </Field>
        </div>

        <div style={styles.formFooter}>
          <button type="button" style={styles.cancelBtn} onClick={() => navigate('/dashboard')}>Anulo</button>
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Duke ruajtur...' : (isEdit ? 'Ruaj Ndryshimet' : 'Krijo Regjistrim')}
          </button>
        </div>
      </form>
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