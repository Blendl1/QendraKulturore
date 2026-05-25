import { useState, useEffect } from 'react';

export default function Sponsoret() {
  const [sponsoret, setSponsoret] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [emri, setEmri] = useState('');
  const [shumaSponsoring, setShumaSponsoring] = useState('');

  useEffect(() => { loadSponsoret(); }, []);

  const loadSponsoret = () => {
    fetch('http://localhost:5002/api/sponzoret', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
      .then(res => res.json())
      .then(data => { setSponsoret(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const handleShto = (e) => {
    e.preventDefault();
    const sponsoriIRi = { emri, shumaSponsoring: parseFloat(shumaSponsoring) };
    fetch('http://localhost:5002/api/sponzoret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(sponsoriIRi)
    })
      .then(res => res.json())
      .then(data => {
        setSponsoret([...sponsoret, data]);
        setEmri(''); setShumaSponsoring('');
        setShowModal(false);
      })
      .catch(err => console.error("Gabim:", err));
  };

  const handleFshij = (id) => {
    if (!window.confirm('A jeni i sigurt që doni ta fshini këtë sponsor?')) return;
    fetch(`http://localhost:5002/api/sponzoret/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    }).then(() => setSponsoret(sponsoret.filter(s => s.id !== id)));
  };

  return (
    <div style={styles.page}>
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Menaxhimi i Sponsorëve & Financave</h1>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>+ Shto Sponsor</button>
        </div>

        {loading ? (
          <div style={styles.loading}>Duke ngarkuar...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Kompania / Sponsori</th>
                  <th style={styles.th}>Vlera e Sponsorizimit</th>
                  <th style={styles.th}>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {sponsoret.map(s => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>{s.emri}</td>
                    <td style={styles.td}>{s.shumaSponsoring} €</td>
                    <td style={styles.td}>
                      <button style={styles.deleteBtn} onClick={() => handleFshij(s.id)}>Fshi</button>
                    </td>
                  </tr>
                ))}
                {sponsoret.length === 0 && (
                  <tr><td colSpan={3} style={styles.empty}>Nuk ka sponsorë.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Shto Sponsor të Ri</h3>
            <form onSubmit={handleShto} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Emri i Kompanisë *</label>
                <input type="text" required style={styles.inputModal} value={emri} onChange={e => setEmri(e.target.value)} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vlera e Sponsorizimit (€) *</label>
                <input type="number" required style={styles.inputModal} value={shumaSponsoring} onChange={e => setShumaSponsoring(e.target.value)} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>Anulo</button>
                <button type="submit" style={styles.saveBtn}>Ruaj</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page:         { display: 'flex', minHeight: '100vh', background: '#0a0a0a' },
  main:         { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle:    { color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 },
  addBtn:       { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  loading:      { color: '#888', textAlign: 'center', padding: 40 },
  tableWrap:    { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, overflow: 'hidden' },
  table:        { width: '100%', borderCollapse: 'collapse' },
  thead:        { borderBottom: '1px solid #333' },
  th:           { color: '#888', fontSize: 12, fontWeight: 600, padding: '12px 16px', textAlign: 'left', textTransform: 'uppercase' },
  tr:           { borderBottom: '1px solid #1f1f1f' },
  td:           { color: '#ddd', fontSize: 14, padding: '14px 16px' },
  empty:        { color: '#555', textAlign: 'center', padding: 40 },
  deleteBtn:    { background: '#2d0000', color: '#f44336', border: '1px solid #f4433630', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 12 },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard:    { background: '#151515', border: '1px solid #333', borderRadius: 12, padding: 24, width: 380 },
  modalTitle:   { color: '#fff', margin: '0 0 16px 0', fontSize: 18 },
  form:         { display: 'flex', flexDirection: 'column', gap: 12 },
  formGroup:    { display: 'flex', flexDirection: 'column', gap: 4 },
  label:        { color: '#888', fontSize: 12 },
  inputModal:   { background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 },
  cancelBtn:    { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 14 },
  saveBtn:      { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};