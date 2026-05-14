import React, { useEffect, useState } from 'react';
import './CrudStyle.css';

function Ekspozitat() {
    const emptyForm = { id: 0, titulli: '', sallaEksponimit: '', dataFillimit: '' };
    const [exh, setExh] = useState(emptyForm);
    const [lista, setLista] = useState([]);
    const [editing, setEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const fetchEkspozitat = () => {
        fetch('http://localhost:5002/api/Ekspozitat')
            .then(res => res.json())
            .then(data => setLista(data));
    };

    useEffect(() => { fetchEkspozitat(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(
            editing ? `http://localhost:5002/api/Ekspozitat/${exh.id}` : 'http://localhost:5002/api/Ekspozitat',
            { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(exh) }
        );
        setExh(emptyForm);
        setEditing(false);
        setShowForm(false);
        fetchEkspozitat();
    };

    const editEkspozita = (item) => {
        setExh({ id: item.id, titulli: item.titulli, sallaEksponimit: item.sallaEksponimit, dataFillimit: item.dataFillimit?.split('T')[0] });
        setEditing(true);
        setShowForm(true);
    };

    const deleteEkspozita = async () => {
        await fetch(`http://localhost:5002/api/Ekspozitat/${confirmDelete}`, { method: 'DELETE' });
        setConfirmDelete(null);
        fetchEkspozitat();
    };

    const filtered = lista.filter(e =>
        e.titulli?.toLowerCase().includes(search.toLowerCase()) ||
        e.sallaEksponimit?.toLowerCase().includes(search.toLowerCase())
    );

    // ── FORMA E PLOTË (si ngjarjet) ──
    if (showForm) {
        return (
            <div style={pageStyle}>
                <div style={headerStyle}>
                    <h1 style={headerTitle}>{editing ? 'Ndrysho Ekspozitën' : 'Shto Ekspozitë të Re'}</h1>
                    <button style={btnBack} onClick={() => { setShowForm(false); setEditing(false); setExh(emptyForm); }}>← Kthehu</button>
                </div>

                <div style={formBox}>
                    <form onSubmit={handleSubmit}>
                        <div style={rowStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Titulli *</label>
                                <input style={inputStyle} value={exh.titulli} onChange={e => setExh({ ...exh, titulli: e.target.value })} required />
                            </div>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Salla Eksponimit *</label>
                                <input style={inputStyle} value={exh.sallaEksponimit} onChange={e => setExh({ ...exh, sallaEksponimit: e.target.value })} required />
                            </div>
                        </div>
                        <div style={rowStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Data e Fillimit *</label>
                                <input style={inputStyle} type="date" value={exh.dataFillimit} onChange={e => setExh({ ...exh, dataFillimit: e.target.value })} required />
                            </div>
                            <div style={fieldStyle}>
                                {/* kolona e dytë bosh ose mund të shtosh field tjetër */}
                            </div>
                        </div>
                        <div style={actionsStyle}>
                            <button type="button" style={btnCancelStyle} onClick={() => { setShowForm(false); setEditing(false); setExh(emptyForm); }}>Anulo</button>
                            <button type="submit" style={btnSubmitStyle}>{editing ? 'Përditëso Ekspozitën' : 'Krijo Ekspozitën'}</button>
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
                <h2 className="crud-title" style={{ margin: 0 }}>Ekspozitat</h2>
                <button style={btnAddStyle} onClick={() => { setExh(emptyForm); setEditing(false); setShowForm(true); }}>+ Shto Ekspozitë</button>
            </div>

            <input style={searchStyle} placeholder="Kërko ekspozitë..." value={search} onChange={e => setSearch(e.target.value)} />

            <div className="crud-list">
                {filtered.map(e => (
                    <div key={e.id} className="crud-card">
                        <h3>{e.titulli}</h3>
                        <p>Salla: {e.sallaEksponimit}</p>
                        <p>Data: {e.dataFillimit?.split('T')[0]}</p>
                        <div className="crud-actions">
                            <button className="btn-edit" onClick={() => editEkspozita(e)}>Edit</button>
                            <button className="btn-delete" onClick={() => setConfirmDelete(e.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {confirmDelete && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <div style={modalIcon}>⚠️</div>
                        <h3 style={modalTitle}>Konfirmo Fshirjen</h3>
                        <p style={modalText}>A jeni i sigurt që dëshironi ta fshini këtë ekspozitë? Ky veprim është i pakthyeshëm.</p>
                        <div style={modalBtns}>
                            <button style={modalCancel} onClick={() => setConfirmDelete(null)}>Anulo</button>
                            <button style={modalConfirm} onClick={deleteEkspozita}>Po, Fshije</button>
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

export default Ekspozitat;