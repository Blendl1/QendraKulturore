import React, { useState, useEffect } from 'react';

function Punetoret() {
  const [punetoret, setPunetoret] = useState([]);
  const [emri, setEmri] = useState('');
  const [mbiemri, setMbiemri] = useState('');
  const [pozita, setpozita] = useState('');

  // 1. Merr punëtorët nga Backend-i kur hapet faqja
  useEffect(() => {
    fetch('http://localhost:5002/api/punetoret', { // Ndrysho portën nëse e ke ndryshe
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Siguria me JWT token
      }
    })
      .then(res => res.json())
      .then(data => setPunetoret(data))
      .catch(err => console.error("Gabim gjatë marrjes së punëtorëve:", err));
  }, []);

  // 2. Funksioni për të shtuar një punëtor të ri (Create)
  const handleShto = (e) => {
    e.preventDefault();
    const punetoriIri = { emri, mbiemri, pozita };

    fetch('http://localhost:5002/api/punetoret', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(punetoriIri)
    })
      .then(res => res.json())
      .then(data => {
        setPunetoret([...punetoret, data]);
        setEmri(''); setMbiemri(''); setpozita(''); // Pastro fushat
      });
  };

  // 3. Funksioni për të fshirë një punëtor (Delete)
  const handleFshij = (id) => {
    fetch(`http://localhost:5002/api/punetoret/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      setPunetoret(punetoret.filter(p => p.id !== id));
    });
  };

  return (
    <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
      <h2>Menaxhimi i Punëtorëve & pozitatamenteve</h2>
      
      {/* Formulari për Shtim */}
      <form onSubmit={handleShto} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Emri" value={emri} onChange={e => setEmri(e.target.value)} required />
        <input type="text" placeholder="Mbiemri" value={mbiemri} onChange={e => setMbiemri(e.target.value)} required />
        <input type="text" placeholder="pozita" value={pozita} onChange={e => setpozita(e.target.value)} required />
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Shto Punëtor</button>
      </form>

      {/* Tabela e Shfaqjes së të Dhënave */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderColor: '#333', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Emri</th>
            <th>Mbiemri</th>
            <th>pozita</th>
            <th>Aksionet</th>
          </tr>
        </thead>
        <tbody>
          {punetoret.map(p => (
            <tr key={p.id}>
              <td>{p.emri}</td>
              <td>{p.mbiemri}</td>
              <td>{p.pozita}</td>
              <td>
                <button onClick={() => handleFshij(p.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Fshij</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Punetoret;