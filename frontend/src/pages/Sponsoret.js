import React, { useState, useEffect } from 'react';

function Sponsoret() {
  const [sponsoret, setSponsoret] = useState([]);
  const [emri, setEmri] = useState('');
  const [shumaSponsoring, setShumaSponsoring] = useState('');

  useEffect(() => {
    fetch('http://localhost:5002/api/sponzoret', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setSponsoret(data))
      .catch(err => console.error("Gabim:", err));
  }, []);

  const handleShto = (e) => {
    e.preventDefault();
    const sponsoriIRi = { emri, shumaSponsoring: parseFloat(shumaSponsoring) };

    fetch('http://localhost:5002/api/sponzoret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(sponsoriIRi)
    })
      .then(res => res.json())
      .then(data => {
        setSponsoret([...sponsoret, data]);
        setEmri('');
        setShumaSponsoring('');
      })
      .catch(err => console.error("Gabim:", err));
  };

  const handleFshij = (id) => {
    fetch(`http://localhost:5002/api/sponzoret/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setSponsoret(sponsoret.filter(s => s.id !== id));
    });
  };

  return (
    <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
      <h2>Menaxhimi i Sponsorëve & Financave</h2>
      
      <form onSubmit={handleShto} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Emri i Kompanisë / Sponsorit" 
          value={emri} 
          onChange={e => setEmri(e.target.value)} 
          required 
        />
        <input 
          type="number" 
          placeholder="Vlera e Sponsorizimit (€)" 
          value={shumaSponsoring} 
          onChange={e => setShumaSponsoring(e.target.value)} 
          required 
        />
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>
          Shto Sponsor
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderColor: '#333', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Kompania / Sponsori</th>
            <th>Vlera e Sponsorizimit</th>
            <th>Aksionet</th>
          </tr>
        </thead>
        <tbody>
          {sponsoret.map(s => (
            <tr key={s.id}>
              <td>{s.emri}</td>
              <td>{s.shumaSponsoring} €</td>
              <td>
                <button onClick={() => handleFshij(s.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  Fshij
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sponsoret;