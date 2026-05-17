import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import imgSkulpture   from '../img/skulpture.jpg';
import imgPikture     from '../img/pikture.png';
import imgGrafike     from '../img/grafike.jpg';
import imgFotografi   from '../img/fotografi.jpg';
import imgArtDigjital from '../img/art_digjital.jpg';
import imgPrishtina   from '../img/prishtina.jpg';
import imgAkademike   from '../img/Academic.png';

const imazhetMap = {
    'Skulpture':    imgSkulpture,
    'Pikture':      imgPikture,
    'Grafike':      imgGrafike,
    'Fotografi':    imgFotografi,
    'Art Digjital': imgArtDigjital,
    'Prishtina':    imgPrishtina,
    'Akademike':    imgAkademike,
};

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}

function PublicVepratArtit() {
    const [veprat, setVeprat]                 = useState([]);
    const [selectedVepra, setSelectedVepra]   = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const navigate = useNavigate();
    const width    = useWindowWidth();
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    const sidePad  = isMobile ? '16px' : isTablet ? '32px' : '60px';
    const gridCols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)';

    useEffect(() => {
        fetch('http://localhost:5002/api/VepratArtit')
            .then(res => res.json())
            .then(data => setVeprat(data));
    }, []);

    return (
        <div style={{ ...styles.section, padding: `60px ${sidePad}` }}>
            <h2 style={styles.sectionTitle}>Veprat e Artit</h2>

            <div style={{ ...styles.grid, gridTemplateColumns: gridCols }}>
                {veprat.map(v => (
                    <div key={v.id} style={styles.card}>
                        <div style={styles.cardBody}>
                            <h3 style={styles.cardTitle}>{v.titulli}</h3>
                            <p style={styles.cardText}><strong>Materiali:</strong> {v.materiali}</p>
                            <p style={styles.cardText}><strong>Viti:</strong> {v.viti}</p>
                            <p style={styles.cardText}><strong>Vlera:</strong> {v.vlera} EUR</p>
                            <div style={{ ...styles.btnRow, flexDirection: isMobile ? 'column' : 'row' }}>
                                <button style={styles.btnPrimary} onClick={() => setSelectedVepra(v)}>
                                    Shiko detajet →
                                </button>
                                <button style={styles.btnSecondary} onClick={() => setSelectedArtist(v.artisti)}>
                                    Shiko artistin →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL VEPRA */}
            {selectedVepra && (
                <div style={styles.overlay} onClick={() => setSelectedVepra(null)}>
                    <div
                        style={{
                            ...styles.modal,
                            width: isMobile ? '95%' : 500,
                            maxHeight: isMobile ? '90vh' : 'auto',
                            overflowY: isMobile ? 'auto' : 'visible',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {imazhetMap[selectedVepra.titulli] && (
                            <img
                                src={imazhetMap[selectedVepra.titulli]}
                                alt={selectedVepra.titulli}
                                style={{ ...styles.modalImg, height: isMobile ? 160 : 260 }}
                            />
                        )}
                        <div style={{ ...styles.modalBody, padding: isMobile ? 18 : 30 }}>
                            <h2 style={{ ...styles.modalTitle, fontSize: isMobile ? 20 : 24 }}>
                                {selectedVepra.titulli}
                            </h2>
                            <div style={{ ...styles.modalGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                                <div>
                                    <p style={styles.modalLabel}>Materiali</p>
                                    <p style={styles.modalValue}>{selectedVepra.materiali}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Viti</p>
                                    <p style={styles.modalValue}>{selectedVepra.viti}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Vlera</p>
                                    <p style={styles.modalValue}>{selectedVepra.vlera} EUR</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Artisti</p>
                                    <p style={styles.modalValue}>
                                        {selectedVepra.artisti?.emri} {selectedVepra.artisti?.mbiemri}
                                    </p>
                                </div>
                            </div>
                            <button style={styles.btnClose} onClick={() => setSelectedVepra(null)}>
                                Mbyll
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ARTISTI */}
            {selectedArtist && (
                <div style={styles.overlay} onClick={() => setSelectedArtist(null)}>
                    <div
                        style={{ ...styles.modal, width: isMobile ? '95%' : 500 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ ...styles.modalBody, padding: isMobile ? 18 : 30 }}>
                            <div style={styles.avatar}>
                                {selectedArtist?.emri?.charAt(0)}{selectedArtist?.mbiemri?.charAt(0)}
                            </div>
                            <h2 style={{ ...styles.modalTitle, fontSize: isMobile ? 20 : 24 }}>
                                {selectedArtist?.emri} {selectedArtist?.mbiemri}
                            </h2>
                            <div style={{ ...styles.modalGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                                <div>
                                    <p style={styles.modalLabel}>Specializimi</p>
                                    <p style={styles.modalValue}>{selectedArtist?.specializimi}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Shteti</p>
                                    <p style={styles.modalValue}>{selectedArtist?.shteti}</p>
                                </div>
                            </div>
                            <div style={{ ...styles.btnRow, flexDirection: isMobile ? 'column' : 'row' }}>
                                <button style={styles.btnClose} onClick={() => setSelectedArtist(null)}>
                                    Mbyll
                                </button>
                                <button style={styles.btnSecondary} onClick={() => navigate('/artistet-public')}>
                                    Shiko të gjithë artistët →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    section:      { fontFamily: 'Georgia, serif' },
    sectionTitle: { fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 40px', borderBottom: '2px solid #111', paddingBottom: 16 },
    grid:         { display: 'grid', gap: 24 },
    card:         { border: '1px solid #e0e0e0', background: '#fff', overflow: 'hidden' },
    cardBody:     { padding: 20 },
    cardTitle:    { fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 12px' },
    cardText:     { fontSize: 14, color: '#666', margin: '6px 0' },
    btnRow:       { display: 'flex', gap: 10, marginTop: 16 },
    btnPrimary:   { flex: 1, background: '#111', color: '#fff', border: 'none', padding: '9px 0', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    btnSecondary: { flex: 1, background: 'none', color: '#111', border: '1px solid #111', padding: '9px 0', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    avatar:       { width: 60, height: 60, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, marginBottom: 20, letterSpacing: 1 },
    overlay:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    modal:        { background: '#fff', overflow: 'hidden' },
    modalImg:     { width: '100%', objectFit: 'cover', display: 'block' },
    modalBody:    {},
    modalTitle:   { fontWeight: 700, color: '#111', margin: '0 0 20px' },
    modalGrid:    { display: 'grid', gap: '12px 24px', marginBottom: 24 },
    modalLabel:   { fontSize: 11, letterSpacing: 2, color: '#888', textTransform: 'uppercase', margin: '0 0 4px' },
    modalValue:   { fontSize: 15, color: '#111', fontWeight: 600, margin: 0 },
    btnClose:     { background: '#111', color: '#fff', border: 'none', padding: '10px 28px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
};

export default PublicVepratArtit;