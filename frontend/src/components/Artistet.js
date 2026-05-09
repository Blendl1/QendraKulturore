import React, { useEffect, useState } from 'react';
import artsImg from '../img/pikture.png';
import academicImg from '../img/Academic.png';
import grafikeImg from '../img/grafike.jpg';
import art_digjitalImg from '../img/art_digjital.jpg';
import skulptureImg from '../img/skulpture.jpg';
import fotografiImg from '../img/fotografi.jpg';
import './CrudStyle.css';

function Artistet() {
    const emptyForm = { id: 0, emri: '', mbiemri: '', specializimi: '', shteti: '' };
    const [artistet, setArtistet] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editing, setEditing] = useState(false);
    const [search, setSearch] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);

    const backgroundMap = {
        'Pikturë': artsImg, 'Skulpturë': skulptureImg,
        'Fotografi': fotografiImg, 'Grafikë': grafikeImg,
        'Art Digjital': art_digjitalImg, 'Akademik': academicImg
    };

    const fetchArtists = () => {
        fetch('http://localhost:5002/api/Artistet')
            .then(res => res.json())
            .then(data => setArtistet(data));
    };

    useEffect(() => { fetchArtists(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(
            editing ? `http://localhost:5002/api/Artistet/${formData.id}` : 'http://localhost:5002/api/Artistet',
            { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) }
        );
        setFormData(emptyForm);
        setEditing(false);
        fetchArtists();
    };

    const editArtisti = (a) => {
        setFormData({ id: a.id, emri: a.emri || '', mbiemri: a.mbiemri || '', specializimi: a.specializimi || '', shteti: a.shteti || '' });
        setEditing(true);
    };

    const deleteArtisti = async () => {
        await fetch(`http://localhost:5002/api/Artistet/${confirmDelete}`, { method: 'DELETE' });
        setConfirmDelete(null);
        fetchArtists();
    };

    const filtered = artistet
        .filter(a => a.emri && a.emri.trim() !== '')
        .filter(a =>
            a.emri?.toLowerCase().includes(search.toLowerCase()) ||
            a.mbiemri?.toLowerCase().includes(search.toLowerCase()) ||
            a.specializimi?.toLowerCase().includes(search.toLowerCase()) ||
            a.shteti?.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div className="crud-page">
            <h2 className="crud-title">Artistët</h2>

            <input style={searchStyle} placeholder="Kërko artist..." value={search} onChange={e => setSearch(e.target.value)} />

            <div className="crud-layout">
                <form className="crud-form" onSubmit={handleSubmit}>
                    <input placeholder="Emri" value={formData.emri} onChange={e => setFormData({ ...formData, emri: e.target.value })} />
                    <input placeholder="Mbiemri" value={formData.mbiemri} onChange={e => setFormData({ ...formData, mbiemri: e.target.value })} />
                    <select value={formData.specializimi} onChange={e => setFormData({ ...formData, specializimi: e.target.value })}>
                        <option value="">Zgjidh Specializimin</option>
                        <option value="Pikturë">Pikturë</option>
                        <option value="Skulpturë">Skulpturë</option>
                        <option value="Fotografi">Fotografi</option>
                        <option value="Grafikë">Grafikë</option>
                        <option value="Art Digjital">Art Digjital</option>
                        <option value="Akademik">Akademik</option>
                    </select>
                    <input placeholder="Shteti" value={formData.shteti} onChange={e => setFormData({ ...formData, shteti: e.target.value })} />
                    <button type="submit">{editing ? 'Përditëso' : 'Shto'}</button>
                    {editing && (
                        <button type="button" className="btn-cancel" onClick={() => { setFormData(emptyForm); setEditing(false); }}>Anulo</button>
                    )}
                </form>

                <div className="crud-list">
                    {filtered.map(a => (
                        <div key={a.id} className="crud-card">
                            <img src={backgroundMap[a.specializimi] || artsImg} alt="Artist"
                                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />
                            <h3>{a.emri} {a.mbiemri}</h3>
                            <p><strong>Specializimi:</strong> {a.specializimi || 'I pa përcaktuar'}</p>
                            <p><strong>Shteti:</strong> {a.shteti || 'I panjohur'}</p>
                            <div className="crud-actions">
                                <button className="btn-edit" onClick={() => editArtisti(a)}>Edit</button>
                                <button className="btn-delete" onClick={() => setConfirmDelete(a.id)}>Delete</button>
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
                        <p style={modalText}>A jeni i sigurt që dëshironi ta fshini këtë artist? Ky veprim është i pakthyeshëm.</p>
                        <div style={modalBtns}>
                            <button style={modalCancel} onClick={() => setConfirmDelete(null)}>Anulo</button>
                            <button style={modalConfirm} onClick={deleteArtisti}>Po, Fshije</button>
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

export default Artistet;