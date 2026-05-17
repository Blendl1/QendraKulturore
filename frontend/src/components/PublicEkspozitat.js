import React, { useEffect, useState } from 'react';

import imgPikture    from '../img/pikture.png';
import imgSkulpture  from '../img/skulpture.jpg';
import imgFotografi  from '../img/fotografi.jpg';
import imgGrafike    from '../img/grafike.jpg';
import imgArtDigjital from '../img/art_digjital.jpg';
import imgPrishtina  from '../img/prishtina.jpg';
import imgAkademike  from '../img/Academic.png';

const imazhetMap = {
    'Pikture':      imgPikture,
    'Skulpture':    imgSkulpture,
    'Fotografi':    imgFotografi,
    'Grafike':      imgGrafike,
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

function PublicEkspozitat() {
    const [ekspozitat, setEkspozitat] = useState([]);
    const [selected, setSelected]     = useState(null);
    const width    = useWindowWidth();
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    const sidePad  = isMobile ? '16px' : isTablet ? '32px' : '60px';
    const gridCols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)';

    useEffect(() => {
        fetch('http://localhost:5002/api/Ekspozitat')
            .then(res => res.json())
            .then(data => setEkspozitat(data));
    }, []);

    return (
        <div style={{ ...styles.section, padding: `60px ${sidePad}` }}>
            <h2 style={styles.sectionTitle}>Ekspozitat</h2>

            <div style={{ ...styles.grid, gridTemplateColumns: gridCols }}>
                {ekspozitat.map(e => {
                    const imgSrc = imazhetMap[e.titulli] || null;
                    return (
                        <div key={e.id} style={styles.card}>
                            {imgSrc && (
                                <img src={imgSrc} alt={e.titulli} style={styles.img} />
                            )}
                            <div style={styles.cardBody}>
                                <h3 style={styles.cardTitle}>{e.titulli}</h3>
                                <p style={styles.cardText}><strong>Salla:</strong> {e.sallaEksponimit}</p>
                                <p style={styles.cardText}><strong>Data:</strong> {e.dataFillimit?.split('T')[0]}</p>
                                <button style={styles.cardBtn} onClick={() => setSelected(e)}>
                                    Shiko detajet →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selected && (
                <div style={styles.overlay} onClick={() => setSelected(null)}>
                    <div
                        style={{
                            ...styles.modal,
                            width: isMobile ? '92%' : 540,
                            maxHeight: '90vh',
                            overflowY: 'auto',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {imazhetMap[selected.titulli] && (
                            <div style={styles.modalImgWrapper}>
                                <img
                                    src={imazhetMap[selected.titulli]}
                                    alt={selected.titulli}
                                    style={{
                                        ...styles.modalImg,
                                        height: isMobile ? 160 : 280,
                                    }}
                                />
                                <div style={styles.modalImgOverlay}>
                                    <h2 style={{
                                        ...styles.modalImgTitle,
                                        fontSize: isMobile ? 18 : 26,
                                    }}>
                                        {selected.titulli}
                                    </h2>
                                </div>
                            </div>
                        )}

                        <div style={{ padding: isMobile ? 16 : 30 }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                gap: isMobile ? '12px' : '16px 24px',
                                marginBottom: 24,
                            }}>
                                <div>
                                    <p style={styles.modalLabel}>Salla e Eksponimit</p>
                                    <p style={styles.modalValue}>{selected.sallaEksponimit}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Data e Fillimit</p>
                                    <p style={styles.modalValue}>{selected.dataFillimit?.split('T')[0]}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Data e Mbarimit</p>
                                    <p style={styles.modalValue}>{selected.dataMbarimit?.split('T')[0] || '—'}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Statusi</p>
                                    <p style={{ ...styles.modalValue, color: '#16a34a' }}>
                                        {selected.statusi || 'Aktive'}
                                    </p>
                                </div>
                            </div>

                            {selected.pershkrimi && (
                                <p style={styles.modalDesc}>{selected.pershkrimi}</p>
                            )}

                            <button style={styles.btnClose} onClick={() => setSelected(null)}>
                                Mbyll
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    section:         { fontFamily: 'Georgia, serif' },
    sectionTitle:    { fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 40px', borderBottom: '2px solid #111', paddingBottom: 16 },
    grid:            { display: 'grid', gap: 24 },
    card:            { border: '1px solid #e0e0e0', background: '#fff', overflow: 'hidden' },
    img:             { width: '100%', height: 180, objectFit: 'cover', display: 'block' },
    cardBody:        { padding: 20 },
    cardTitle:       { fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 10px' },
    cardText:        { fontSize: 14, color: '#666', margin: '6px 0' },
    cardBtn:         { background: '#111', color: '#fff', border: 'none', padding: '8px 16px', fontSize: 13, cursor: 'pointer', marginTop: 12, width: '100%', letterSpacing: 1 },
    overlay:         { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    modal:           { background: '#fff', overflow: 'hidden' },
    modalImgWrapper: { position: 'relative' },
    modalImg:        { width: '100%', objectFit: 'cover', display: 'block' },
    modalImgOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '40px 24px 16px' },
    modalImgTitle:   { color: '#fff', fontWeight: 700, margin: 0 },
    modalLabel:      { fontSize: 11, letterSpacing: 2, color: '#888', textTransform: 'uppercase', margin: '0 0 4px' },
    modalValue:      { fontSize: 15, color: '#111', fontWeight: 600, margin: 0 },
    modalDesc:       { fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 24px', borderTop: '1px solid #e0e0e0', paddingTop: 16 },
    btnClose:        { background: '#111', color: '#fff', border: 'none', padding: '10px 28px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
};

export default PublicEkspozitat;