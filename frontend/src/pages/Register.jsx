import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Regjistrimi dështoi. Provo përsëri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>QendraKulturore</div>
        <h2 style={styles.title}>Krijo llogari</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Emri i plotë</label>
            <input
              style={styles.input}
              type="text"
              name="fullName"
              placeholder="Emri Mbiemri"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="email@shembull.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Fjalëkalimi</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Minimum 6 karaktere"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Konfirmo fjalëkalimin</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Përsërit fjalëkalimin"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
          </button>

          <p style={styles.loginText}>
            Ke llogari?{' '}
            <Link to="/login" style={styles.loginLink}>Kyçu këtu</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card:       { background: '#111', border: '1px solid #222', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 420 },
  logo:       { color: '#c8a96e', fontWeight: 700, fontSize: 18, textAlign: 'center', marginBottom: 8 },
  title:      { color: '#fff', fontSize: 22, fontWeight: 600, textAlign: 'center', marginBottom: 24, margin: '0 0 24px' },
  error:      { background: '#3a1a1a', color: '#f44336', border: '1px solid #f4433633', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14 },
  form:       { display: 'flex', flexDirection: 'column', gap: 16 },
  field:      { display: 'flex', flexDirection: 'column', gap: 6 },
  label:      { color: '#888', fontSize: 13 },
  input:      { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' },
  btn:        { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4 },
  loginText:  { color: '#888', fontSize: 13, textAlign: 'center', margin: 0 },
  loginLink:  { color: '#c8a96e', textDecoration: 'none', fontWeight: 600 },
};