import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

function PublicWorkshopet() {
    const { user } = useAuth();
    const [workshopet, setWorkshopet] = useState([]);
    const [selected, setSelected] = useState(null);
    const [numPjesemarresish, setNumPjesemarresish] = useState(0);
    const [loadingPjesemarres, setLoadingPjesemarres] = useState(false);
    const [regjistrime, setRegjistrime] = useState([]);
    const [duke_regjistruar, setDukeRegjistruar] = useState(false);
    const [mesazhi, setMesazhi] = useState('');

    useEffect(() => {
        apiClient.get('/Workshop')
            .then(res => setWorkshopet(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleShikoDetajet = async (w) => {
        setSelected(w);
        setMesazhi('');
        setLoadingPjesemarres(true);
        try {
            const res = await apiClient.get('/RegjistrimWorkshop');
            setRegjistrime(res.data);
            const count = res.data.filter(r => r.workshopId === w.id && r.statusi === 'Aktiv').length;
            setNumPjesemarresish(count);
        } catch {
            setNumPjesemarresish(0);
        } finally {
            setLoadingPjesemarres(false);
        }
    };

    const eshtIRegjistruar = () => {
        if (!user || !selected) return false;
        return regjistrime.some(r =>
            r.workshopId === selected.id &&
            r.statusi === 'Aktiv' &&
            (r.pjesemarres?.email === user.email || r.pjesemarresId === user.id)
        );
    };

    const handleRegjistrohu = async () => {
        if (!user) {
            setMesazhi('Duhet të jeni të kyçur për t\'u regjistruar.');
            return;
        }
        if (numPjesemarresish >= selected.kapaciteti) {
            setMesazhi('Workshop-u është i mbushur plotësisht.');
            return;
        }
        setDukeRegjistruar(true);
        setMesazhi('');
        try {
            let pjesemarresId = null;
            const pRes = await apiClient.get('/Pjesemarres');
            const ekziston = pRes.data.find(p => p.email === user.email);
            if (ekziston) {
                pjesemarresId = ekziston.id;
            } else {
                const krijuar = await apiClient.post('/Pjesemarres', {
                    emri: user.fullName?.split(' ')[0] || user.email,
                    mbiemri: user.fullName?.split(' ')[1] || '',
                    email: user.email,
                    telefoni: '',
                });
                pjesemarresId = krijuar.data.id;
            }
            await apiClient.post('/RegjistrimWorkshop', {
                workshopId: selected.id,
                pjesemarresId: pjesemarresId,
                statusi: 'Aktiv',
                eshtePaguar: false,
            });
            const res2 = await apiClient.get('/RegjistrimWorkshop');
            setRegjistrime(res2.data);
            const count = res2.data.filter(r => r.workshopId === selected.id && r.statusi === 'Aktiv').length;
            setNumPjesemarresish(count);
            setMesazhi('U regjistruat me sukses!');
        } catch (err) {
            const errData = err.response?.data;
            setMesazhi(typeof errData === 'string' ? errData : 'Gabim gjatë regjistrimit.');
        } finally {
            setDukeRegjistruar(false);
        }
    };

    const getMesazhiColor = () => {
        if (typeof mesazhi !== 'string') return '#c62828';
        return mesazhi.includes('sukses') ? '#16a34a' : '#c62828';
    };

    const getMesazhiText = () => {
        if (typeof mesazhi !== 'string') return 'Gabim gjatë regjistrimit.';
        return mesazhi;
    };

    return (
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Workshopet</h2>

            <div style={styles.grid}>
                {workshopet.length === 0 && (
                    <p style={{ color: '#888', fontSize: 16 }}>Nuk ka workshop për momentin.</p>
                )}
                {workshopet.map(w => (
                    <div key={w.id} style={styles.card}>
                        <div style={styles.cardBody}>
                            <div style={styles.cardType}>Workshop</div>
                            <h3 style={styles.cardTitle}>{w.titulli}</h3>
                            <p style={styles.cardText}><strong>Data:</strong> {w.dataFillimit?.split('T')[0]}</p>
                            <p style={styles.cardText}><strong>Çmimi:</strong> EUR {w.cmimi}</p>
                            <p style={styles.cardText}><strong>Kapaciteti:</strong> {w.kapaciteti} persona</p>
                            <div style={styles.cardFooter}>
                                <StatusBadge status={w.statusi} />
                                <button style={styles.cardBtn} onClick={() => handleShikoDetajet(w)}>
                                    Shiko detajet →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <div style={styles.overlay} onClick={() => setSelected(null)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div style={styles.modalHeaderType}>Workshop</div>
                            <h2 style={styles.modalImgTitle}>{selected.titulli}</h2>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.modalGrid}>
                                <div>
                                    <p style={styles.modalLabel}>Data e Fillimit</p>
                                    <p style={styles.modalValue}>{selected.dataFillimit?.split('T')[0]}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Data e Përfundimit</p>
                                    <p style={styles.modalValue}>{selected.dataPerfundimit?.split('T')[0]}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Çmimi</p>
                                    <p style={styles.modalValue}>EUR {selected.cmimi}</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Kapaciteti</p>
                                    <p style={styles.modalValue}>{selected.kapaciteti} persona</p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Statusi</p>
                                    <p style={{ ...styles.modalValue, color: selected.statusi === 'Aktiv' ? '#16a34a' : '#2196f3' }}>
                                        {selected.statusi}
                                    </p>
                                </div>
                                <div>
                                    <p style={styles.modalLabel}>Pjesëmarrësit e Regjistruar</p>
                                    <p style={{ ...styles.modalValue, color: '#c8a96e', fontSize: 22 }}>
                                        {loadingPjesemarres ? '...' : `${numPjesemarresish} / ${selected.kapaciteti}`}
                                    </p>
                                </div>
                            </div>

                            {selected.pershkrimi && (
                                <p style={styles.modalDesc}>{selected.pershkrimi}</p>
                            )}

                            <div style={styles.progressWrapper}>
                                <p style={styles.modalLabel}>Mbushja e Kapacitetit</p>
                                <div style={styles.progressBar}>
                                    <div style={{
                                        ...styles.progressFill,
                                        width: `${Math.min((numPjesemarresish / selected.kapaciteti) * 100, 100)}%`,
                                        background: numPjesemarresish >= selected.kapaciteti ? '#c62828' : '#16a34a',
                                    }} />
                                </div>
                                <p style={styles.progressText}>
                                    {numPjesemarresish >= selected.kapaciteti ? 'I mbushur plotësisht' : `${selected.kapaciteti - numPjesemarresish} vende të lira`}
                                </p>
                            </div>

                            {mesazhi !== '' && (
                                <p style={{ ...styles.mesazhi, color: getMesazhiColor(), borderLeftColor: getMesazhiColor() }}>
                                    {getMesazhiText()}
                                </p>
                            )}

                            <div style={styles.btnRow}>
                                <button style={styles.btnClose} onClick={() => setSelected(null)}>
                                    Mbyll
                                </button>

                                {eshtIRegjistruar() ? (
                                    <button style={styles.btnRegjistruar} disabled>
                                        ✓ I Regjistruar
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            ...styles.btnRegjistrohu,
                                            opacity: (duke_regjistruar || numPjesemarresish >= selected.kapaciteti) ? 0.6 : 1,
                                            cursor: (duke_regjistruar || numPjesemarresish >= selected.kapaciteti) ? 'not-allowed' : 'pointer',
                                        }}
                                        onClick={handleRegjistrohu}
                                        disabled={duke_regjistruar || numPjesemarresish >= selected.kapaciteti}
                                    >
                                        {duke_regjistruar ? 'Duke regjistruar...' : 'Regjistrohu'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        Aktiv:       { bg: '#e8f5e9', color: '#2e7d32' },
        Planifikuar: { bg: '#e3f2fd', color: '#1565c0' },
        Perfunduar:  { bg: '#f5f5f5', color: '#888' },
        Anuluar:     { bg: '#ffebee', color: '#c62828' },
    };
    const c = colors[status] || colors.Planifikuar;
    return (
        <span style={{ background: c.bg, color: c.color, padding: '3px 10px', fontSize: 11, letterSpacing: 1 }}>
            {status}
        </span>
    );
}

const styles = {
    section:            { padding: '60px' },
    sectionTitle:       { fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 40px', borderBottom: '2px solid #111', paddingBottom: 16, fontFamily: 'Georgia, serif' },
    grid:               { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 },
    card:               { border: '1px solid #e0e0e0', background: '#fff', overflow: 'hidden' },
    cardBody:           { padding: 24 },
    cardType:           { fontSize: 11, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 12 },
    cardTitle:          { fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 12px', fontFamily: 'Georgia, serif' },
    cardText:           { fontSize: 14, color: '#666', margin: '6px 0' },
    cardFooter:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
    cardBtn:            { background: '#111', color: '#fff', border: 'none', padding: '8px 16px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    overlay:            { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    modal:              { background: '#fff', width: 540, maxWidth: '90%', overflow: 'hidden' },
    modalHeader:        { background: '#111', padding: '40px 30px 24px' },
    modalHeaderType:    { fontSize: 11, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 8 },
    modalImgTitle:      { color: '#fff', fontSize: 26, fontWeight: 700, margin: 0, fontFamily: 'Georgia, serif' },
    modalBody:          { padding: 30 },
    modalGrid:          { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginBottom: 24 },
    modalLabel:         { fontSize: 11, letterSpacing: 2, color: '#888', textTransform: 'uppercase', margin: '0 0 4px' },
    modalValue:         { fontSize: 15, color: '#111', fontWeight: 600, margin: 0 },
    modalDesc:          { fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 24px', borderTop: '1px solid #e0e0e0', paddingTop: 16 },
    progressWrapper:    { marginBottom: 24 },
    progressBar:        { height: 8, background: '#e0e0e0', marginTop: 8, marginBottom: 6 },
    progressFill:       { height: '100%', transition: 'width 0.4s ease' },
    progressText:       { fontSize: 12, color: '#888', margin: 0 },
    mesazhi:            { fontSize: 14, fontWeight: 600, margin: '0 0 16px', padding: '10px 14px', background: '#f9f9f9', borderLeft: '3px solid' },
    btnRow:             { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btnClose:           { background: '#fff', color: '#111', border: '1px solid #111', padding: '10px 28px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    btnRegjistrohu:     { background: '#111', color: '#fff', border: 'none', padding: '10px 28px', fontSize: 13, letterSpacing: 1 },
    btnRegjistruar:     { background: '#e8f5e9', color: '#2e7d32', border: '1px solid #2e7d32', padding: '10px 28px', fontSize: 13, letterSpacing: 1, cursor: 'default' },
};

export default PublicWorkshopet;