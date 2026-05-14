import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import imgPikture from '../img/pikture.png';
import imgGrafike from '../img/grafike.jpg';
import imgArtDigjital from '../img/art_digjital.jpg';
import imgFotografi from '../img/fotografi.jpg';
import imgSkulpture from '../img/skulpture.jpg';
import imgAcademic from '../img/Academic.png';
import imgDefault from '../img/prishtina.jpg';

const specializimImazhet = {
    'Pikture': imgPikture,
    'Pikturë': imgPikture,
    'Grafikë': imgGrafike,
    'Grafike': imgGrafike,
    'Art Digjital': imgArtDigjital,
    'Fotografi': imgFotografi,
    'Skulpturë': imgSkulpture,
    'Skulpture': imgSkulpture,
    'Akademike': imgAcademic,
};

const getImazhi = (specializimi) => specializimImazhet[specializimi] ?? imgDefault;

function PublicArtistet({ filterId = null }) {
    const [artistet, setArtistet] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5002/api/Artistet')
            .then(res => res.json())
            .then(data => setArtistet(data));
    }, []);

    const lista = filterId ? artistet.filter(a => a.id === filterId) : artistet;

    return (
        <div style={styles.section}>
            <div style={styles.topBar}>
                <h2 style={styles.sectionTitle}>Artistët</h2>
                <button style={styles.btnBack} onClick={() => navigate('/home')}>
                    ← Kthehu
                </button>
            </div>

            <div style={styles.grid}>
                {lista.map(a => (
                    <div key={a.id} style={styles.card}>
                        <img
                            src={getImazhi(a.specializimi)}
                            alt={a.specializimi}
                            style={styles.specImg}
                        />
                        <div style={styles.avatar}>
                            {a.emri?.charAt(0)}{a.mbiemri?.charAt(0)}
                        </div>
                        <h3 style={styles.cardTitle}>{a.emri} {a.mbiemri}</h3>
                        <p style={styles.cardText}><strong>Specializimi:</strong> {a.specializimi}</p>
                        <p style={styles.cardText}><strong>Shteti:</strong> {a.shteti}</p>
                        <button style={styles.btnPrimary} onClick={() => navigate('/veprat-public')}>
                            Shiko veprat e artit →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    section: { padding: '60px', fontFamily: 'Georgia, serif' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, borderBottom: '2px solid #111', paddingBottom: 16 },
    sectionTitle: { fontSize: 28, fontWeight: 700, color: '#111', margin: 0 },
    btnBack: { background: 'none', border: '1px solid #111', color: '#111', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1, fontFamily: 'Georgia, serif' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 },
    card: { border: '1px solid #e0e0e0', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' },
    specImg: { width: '100%', height: 160, objectFit: 'cover', display: 'block' },
    avatar: { width: 52, height: 52, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, margin: '20px 28px 12px', letterSpacing: 1 },
    cardTitle: { fontSize: 18, fontWeight: 700, color: '#111', margin: '0 28px 12px', fontFamily: 'Georgia, serif' },
    cardText: { fontSize: 14, color: '#666', margin: '4px 28px' },
    btnPrimary: { background: '#111', color: '#fff', border: 'none', padding: '9px 16px', fontSize: 13, cursor: 'pointer', letterSpacing: 1, margin: '16px 28px 28px', width: 'calc(100% - 56px)' },
};

export default PublicArtistet;