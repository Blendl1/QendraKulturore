import React, { useState } from 'react';

function Ekspozitat() {
    const [exh, setExh] = useState({ titulli: '', salla: '', data: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5002/api/Ekspozitat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exh)
        });
        alert("Ekspozita u planifikua!");
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd' }}>
            <h2>Planifikimi i Ekspozitave</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
                <input placeholder="Titulli i Ekspozitës" onChange={e => setExh({...exh, titulli: e.target.value})} />
                <input placeholder="Salla (p.sh. Salla A1)" onChange={e => setExh({...exh, salla: e.target.value})} />
                <input type="date" onChange={e => setExh({...exh, data: e.target.value})} />
                <button type="submit" style={{ background: '#00b894', color: 'white', border: 'none', padding: '10px' }}>
                    Planifiko
                </button>
            </form>
        </div>
    );
}

export default Ekspozitat;