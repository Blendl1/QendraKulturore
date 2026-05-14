import React, { useEffect, useState } from 'react';
import './CrudStyle.css';

function VepratArtit() {
    const emptyForm = { id: 0, titulli: '', materiali: '', viti: 2026, vlera: 0, artistiId: '' };
    const [artistet, setArtistet] = useState([]);
    const [veprat, setVeprat] = useState([]);
    const [vepraData, setVepraData] = useState(emptyForm);
    const [editing, setEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
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
        setShowForm(false);
        fetchData();
    };

    const editVepra = (v) => {
        setVepraData({ id: v.id, titulli: v.titulli || '', materiali: v.materiali || '', viti: v.viti || 2026, vlera: v.vlera || 0, artistiId: v.artistiID || v.artistiId || '' });
        setEditing(true);
        setShowForm(true);
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

    // ── FORMA E PLOTË (si ngjarjet) ──
    if (showForm) {
        return (
            <div style={pageStyle}>
                <div style={headerStyle}>
                    <h1 style={headerTitle}>{editing ? 'Ndrysho Veprën e Artit' : 'Shto Vepër Arti të Re'}</h1>
                    <button style={btnBack} onClick={() => { setShowForm(false); setEditing(false); setVepraData(emptyForm); }}>← Kthehu</button>
                </div>

                <div style={formBox}>
                    <form onSubmit={handleSubmit}>
                        <div style={rowStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Titulli *</label>
                                <input style={inputStyle} value={vepraData.titulli} onChange={e => setVepraData({ ...vepraData, titulli: e.target.value })} required />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Materiali *</label>
                                <input style={inputStyle} value={vepraData.materiali} onChange={e => setVepraData({ ...vepraData, materiali: e.target.value })} required />
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Viti i Krijimit *</label>
                                <input style={inputStyle} type="number" value={vepraData.viti} onChange={e => setVepraData({ ...vepraData, viti: e.target.value })} required />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Vlera (EUR)</label>
                                <input style={inputStyle} type="number" value={vepraData.vlera} onChange={e => setVepraData({ ...vepraData, vlera: e.target.value })} />
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Artisti *</label>
                                <select style={inputStyle} value={vepraData.artistiId} onChange={e => setVepraData({ ...vepraData, artistiId: e.target.value })} required>
                                    <option value="">Zgjidh Artistin</option>
                                    {artistet.map(a => (
                                        <option key={a.id} value={a.id}>{a.emri} {a.mbiemri}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={fieldStyle}>
                                {/* kolona e dytë rezervë */}
                            </div>
                        </div>
                        <div style={actionsStyle}>
                            <button type="button" style={btnCancelStyle} onClick={() => { setShowForm(false); setEditing(false); setVepraData(emptyForm); }}>Anulo</button>
                            <button type="submit" style={btnSubmitStyle}>{editing ? 'Përditëso Veprën' : 'Krijo Veprën'}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // ── LISTA ──
    return (
        <div className="crud-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="crud-title" style={{ margin: 0 }}>Veprat e Artit</h2>
                <button style={btnAddStyle} onClick={() => { setVepraData(emptyForm); setEditing(false); setShowForm(true); }}>+ Shto Vepër</button>
            </div>

            <input style={searchStyle} placeholder="Kërko vepër arti..." value={search} onChange={e => setSearch(e.target.value)} />

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

// ── STYLES ──
const pageStyle = { minHeight: '100vh', background: '#0d0d0d', color: '#e8e8e8' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid #222' };
const headerTitle = { fontSize: 26, fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Georgia, serif' };
const btnBack = { background: '#1a1a1a', border: '1px solid #333', color: '#ccc', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14 };
const btnAddStyle = { background: '#c9a84c', border: 'none', color: '#111', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 };
const formBox = { margin: '28px 32px', background: '#161616', border: '1px solid #252525', borderRadius: 12, padding: '28px 32px' };
const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 };
const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 6 };
const labelStyle = { fontSize: 12, color: '#999', letterSpacing: '0.4px', fontFamily: 'sans-serif' };
const inputStyle = { background: '#0f0f0f', border: '1px solid #2a2a2a', color: '#e8e8e8', padding: '10px 14px', borderRadius: 6, fontSize: 14, fontFamily: 'sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' };
const actionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 };
const btnCancelStyle = { background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '10px 24px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontFamily: 'sans-serif' };
const btnSubmitStyle = { background: '#c9a84c', border: 'none', color: '#111', padding: '10px 26px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'sans-serif' };

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