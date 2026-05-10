import React, { useEffect, useState } from 'react';
import './CrudStyle.css';

function VepratArtit() {
    const emptyForm = { id: 0, titulli: '', materiali: '', viti: 2026, vlera: 0, artistiId: '' };
    const [artistet, setArtistet] = useState([]);
    const [veprat, setVeprat] = useState([]);
    const [vepraData, setVepraData] = useState(emptyForm);
    const [editing, setEditing] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchData = () => {
        fetch('http://localhost:5002/api/Artistet').then(res => res.json()).then(data => setArtistet(data));
        fetch('http://localhost:5002/api/VepratArtit').then(res => res.json()).then(data => setVeprat(data));
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...vepraData, artistiId: parseInt(vepraData.artistiId), vlera: parseFloat(vepraData.vlera), viti: parseInt(vepraData.viti) };
        await fetch(
            editing ? `http://localhost:5002/api/VepratArtit/${vepraData.id}` : 'http://localhost:5002/api/VepratArtit',
            { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
        );
        setVepraData(emptyForm);
        setEditing(false);
        fetchData();
    };

    const editVepra = (v) => {
        setVepraData({ id: v.id, titulli: v.titulli || '', materiali: v.materiali || '', viti: v.viti || 2026, vlera: v.vlera || 0, artistiId: v.artistiID || v.artistiId || '' });
        setEditing(true);
    };

    const deleteVepra = async () => {
        await fetch(`http://localhost:5002/api/VepratArtit/${confirmDelete}`, { method: 'DELETE' });
        setConfirmDelete(null);
        fetchData();
    };

    const filtered = veprat.filter(v =>
        v.titulli?.toLowerCase().includes(search.toLowerCase()) ||
        v.materiali?.toLowerCase().includes(search.toLowerCase()) ||
        v.artisti?.emri?.toLowerCase().includes(search.toLowerCase()) ||
        v.artisti?.mbiemri?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="crud-page">
            <h2 className="crud-title">Veprat e Artit</h2>

            <input style={searchStyle} placeholder="Kërko vepër arti..." value={search} onChange={e => setSearch(e.target.value)} />

            <div className="crud-layout">
                <form className="crud-form" onSubmit={handleSubmit}>
                    <input placeholder="Titulli" value={vepraData.titulli} onChange={e => setVepraData({ ...vepraData, titulli: e.target.value })} />
                    <input placeholder="Materiali" value={vepraData.materiali} onChange={e => setVepraData({ ...vepraData, materiali: e.target.value })} />
                    <input type="number" placeholder="Viti" value={vepraData.viti} onChange={e => setVepraData({ ...vepraData, viti: e.target.value })} />
                    <input type="number" placeholder="Vlera" value={vepraData.vlera} onChange={e => setVepraData({ ...vepraData, vlera: e.target.value })} />
                    <select value={vepraData.artistiId} onChange={e => setVepraData({ ...vepraData, artistiId: e.target.value })}>
                        <option value="">Zgjidh Artistin</option>
                        {artistet.map(a => (
                            <option key={a.id} value={a.id}>{a.emri} {a.mbiemri}</option>
                        ))}
                    </select>
                    <button type="submit">{editing ? 'Përditëso' : 'Shto'}</button>
                    {editing && (
                        <button type="button" className="btn-cancel" onClick={() => { setVepraData(emptyForm); setEditing(false); }}>Anulo</button>
                    )}
                </form>

                <div className="crud-list">
                    {filtered.map(v => (
                        <div key={v.id} className="crud-card">
                            <h3>{v.titulli}</h3>
                            <p>Materiali: {v.materiali}</p>
                            <p>Viti: {v.viti}</p>
                            <p>Vlera: {v.vlera} EUR</p>
                            <p>Artisti: {v.artisti?.emri} {v.artisti?.mbiemri}</p>
                            <div className="crud-actions">
                                <button className="btn-edit" onClick={() => editVepra(v)}>Edit</button>
                                <button className="btn-delete" onClick={() => setConfirmDelete(v.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {confirmDelete && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={modalIcon}>⚠️</div>
                        <h3 style={modalTitle}>Konfirmo Fshirjen</h3>
                        <p style={modalText}>A jeni i sigurt që dëshironi ta fshini këtë vepër arti? Ky veprim është i pakthyeshëm.</p>
                        <div style={modalBtns}>
                            <button style={modalCancel} onClick={() => setConfirmDelete(null)}>Anulo</button>
                            <button style={modalConfirm} onClick={deleteVepra}>Po, Fshije</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const searchStyle = { background: '#111', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: 300, marginBottom: 24, display: 'block' };
const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox = { background: '#1a1a1a', border: '1px solid #333', borderRadius: 16, padding: '36px 32px', width: 400, maxWidth: '90%', textAlign: 'center' };
const modalIcon = { fontSize: 40, marginBottom: 16 };
const modalTitle = { color: '#fff', fontSize: 20, fontWeight: 700, margin: '0 0 12px' };
const modalText = { color: '#888', fontSize: 14, lineHeight: 1.6, margin: '0 0 28px' };
const modalBtns = { display: 'flex', gap: 12, justifyContent: 'center' };
const modalCancel = { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', fontSize: 14 };
const modalConfirm = { background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 600 };

export default VepratArtit;