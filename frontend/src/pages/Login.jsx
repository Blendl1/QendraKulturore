import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Email ose fjalëkalimi është gabim.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>QendraKulturore</h1>
        <p style={styles.subtitle}>Sistemi i Menaxhimit</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Fjalëkalimi</label>
            <input
              style={styles.input}
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Duke hyrë...' : 'Hyr'}
          </button>
        </form>

        <p style={styles.registerText}>
          Nuk ke llogari?{' '}
          <Link to="/register" style={styles.registerLink}>Regjistrohu këtu</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 12,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 700,
    margin: '0 0 4px 0',
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    margin: '0 0 32px 0',
  },
  error: {
    background: '#2d0000',
    border: '1px solid #ff4444',
    color: '#ff4444',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    marginBottom: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    background: '#111',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#fff',
    fontSize: 14,
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    background: '#c8a96e',
    color: '#000',
    border: 'none',
    borderRadius: 8,
    padding: '12px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  registerText: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  registerLink: {
    color: '#c8a96e',
    textDecoration: 'none',
    fontWeight: 600,
  },
};