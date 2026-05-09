import React, { useEffect, useState } from 'react';
import './CrudStyle.css';

function Ekspozitat() {
    const emptyForm = { id: 0, titulli: '', sallaEksponimit: '', dataFillimit: '' };
    const [exh, setExh] = useState(emptyForm);
    const [lista, setLista] = useState([]);
    const [editing, setEditing] = useState(false);
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
        fetchEkspozitat();
    };

    const editEkspozita = (item) => {
        setExh({ id: item.id, titulli: item.titulli, sallaEksponimit: item.sallaEksponimit, dataFillimit: item.dataFillimit?.split('T')[0] });
        setEditing(true);
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

    return (
        <div className="crud-page">
            <h2 className="crud-title">Ekspozitat</h2>

            <input style={searchStyle} placeholder="Kërko ekspozitë..." value={search} onChange={e => setSearch(e.target.value)} />

            <div className="crud-layout">
                <form className="crud-form" onSubmit={handleSubmit}>
                    <input placeholder="Titulli" value={exh.titulli} onChange={e => setExh({ ...exh, titulli: e.target.value })} />
                    <input placeholder="Salla" value={exh.sallaEksponimit} onChange={e => setExh({ ...exh, sallaEksponimit: e.target.value })} />
                    <input type="date" value={exh.dataFillimit} onChange={e => setExh({ ...exh, dataFillimit: e.target.value })} />
                    <button type="submit">{editing ? 'Përditëso' : 'Shto'}</button>
                    {editing && (
                        <button type="button" className="btn-cancel" onClick={() => { setExh(emptyForm); setEditing(false); }}>Anulo</button>
                    )}
                </form>

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