import React, { useEffect, useState } from 'react';

function VepratArtit() {
    const [artistet, setArtistet] = useState([]);
    const [veprat, setVeprat] = useState([]);
    const [vepraData, setVepraData] = useState({ titulli: '', materiali: '', viti: 2026, vlera: 0, artistiId: '' });

    useEffect(() => {
        fetch('http://localhost:5002/api/Artistet').then(res => res.json()).then(data => setArtistet(data));
        fetch('http://localhost:5002/api/VepratArtit/stats').then(() => {
             fetch('http://localhost:5002/api/Artistet'); // Dummy fetch for list
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:5002/api/VepratArtit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...vepraData, artistiId: parseInt(vepraData.artistiId), vlera: parseFloat(vepraData.vlera) })
        });
        alert("Vepra u shtua!");
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h2>Shto Vepër Arti</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Titulli" onChange={e => setVepraData({...vepraData, titulli: e.target.value})} />
                    <input placeholder="Materiali" onChange={e => setVepraData({...vepraData, materiali: e.target.value})} />
                    <input type="number" placeholder="Vlera (€)" onChange={e => setVepraData({...vepraData, vlera: e.target.value})} />
                    <select onChange={e => setVepraData({...vepraData, artistiId: e.target.value})}>
                        <option value="">Zgjidh Artistin</option>
                        {artistet.map(a => <option key={a.id} value={a.id}>{a.emri} {a.mbiemri}</option>)}
                    </select>
                    <button type="submit">Ruaj Veprën</button>
                </form>
            </div>
        </div>
    );
}

export default VepratArtit;