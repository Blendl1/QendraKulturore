import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import PublicEkspozitat from '../components/PublicEkspozitat';
import PublicVepratArtit from '../components/PublicVepratArtit';
import PublicWorkshopet from '../components/PublicWorkshopet';

// Modal që shfaqet kur useri nuk është i loguar
function LoginModal({ onClose, navigate }) {
    return (
        <div style={modal.overlay} onClick={onClose}>
            <div style={modal.box} onClick={e => e.stopPropagation()}>
                <div style={modal.icon}>🔒</div>
                <h2 style={modal.title}>Kërkohet Llogaria</h2>
                <p style={modal.desc}>
                    Duhet të jesh i loguar për të parë detajet e ngjarjeve, ekspozitave, workshopeve dhe veprave të artit.
                </p>
                <div style={modal.buttons}>
                    <button style={modal.btnLogin} onClick={() => navigate('/login')}>
                        Hyr në Llogari
                    </button>
                    <button style={modal.btnRegister} onClick={() => navigate('/register')}>
                        Krijo Llogari
                    </button>
                </div>
                <button style={modal.btnClose} onClick={onClose}>✕</button>
            </div>
        </div>
    );
}

export default function Home() {
    const [ngjarjet, setNgjarjet]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState('');
    const [showModal, setShowModal]   = useState(false);
    const navigate                    = useNavigate();
    const { user, logout }            = useAuth();

    useEffect(() => { loadNgjarjet(); }, []);

    const loadNgjarjet = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/Ngjarja');
            setNgjarjet(res.data);
        } catch (err) {
            setError('Nuk u ngarkuan ngjarjet. Provoni perseri.');
        } finally {
            setLoading(false);
        }
    };

    // Funksioni që kontrollon login para navigimit
    const handleProtectedClick = (path) => {
        if (!user) {
            setShowModal(true);
        } else {
            navigate(path);
        }
    };

    return (
        <div style={styles.page}>

            {/* MODAL */}
            {showModal && <LoginModal onClose={() => setShowModal(false)} navigate={navigate} />}

            {/* NAVBAR */}
            <nav style={styles.nav}>
                <div style={styles.navLogo}>QendraKulturore</div>
                <div style={styles.navLinks}>
                    <span style={styles.navLink}>Ngjarjet</span>
                    <span style={styles.navLink} onClick={() => navigate('/artistet-public')}>Artistët</span>
                    <span style={styles.navLink} onClick={() => navigate('/per-ne')}>Për Ne</span>
                    <span style={styles.navLink} onClick={() => navigate('/kontakt')}>Kontakt</span>

                    {!user ? (
                        <button style={styles.navBtn} onClick={() => navigate('/login')}>Hyr</button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            {user.roles?.includes('Admin') && (
                                <button style={styles.dashboardBtn} onClick={() => navigate('/dashboard')}>Dashboard</button>
                            )}
                            <button style={styles.logoutBtn} onClick={logout}>Dil</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <div style={styles.hero}>
                <p style={styles.heroSub}>Qendra Kulturore</p>
                <h1 style={styles.heroTitle}>Ngjarjet & Aktivitetet</h1>
                <p style={styles.heroDesc}>Zbuloni ngjarjet kulturore, koncertet, shfaqjet teatrore dhe workshopet tona.</p>
            </div>

            {/* NGJARJET */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Ngjarjet e Ardhshme</h2>

                {loading && <p style={styles.loading}>Duke ngarkuar ngjarjet...</p>}
                {error   && <p style={styles.error}>{error}</p>}

                {!loading && !error && (
                    <div style={styles.grid}>
                        {ngjarjet.length === 0 ? (
                            <p style={styles.empty}>Nuk ka ngjarje për momentin.</p>
                        ) : (
                            ngjarjet.map(ngjarja => (
                                <div key={ngjarja.id} style={styles.card}>
                                    <div style={styles.cardType}>{ngjarja.lloji}</div>
                                    <h3 style={styles.cardTitle}>{ngjarja.titulli}</h3>
                                    <p style={styles.cardDesc}>{ngjarja.pershkrimi?.slice(0, 100)}...</p>
                                    <div style={styles.cardFooter}>
                                        <span style={styles.cardDate}>{new Date(ngjarja.dataFillimit).toLocaleDateString('sq-AL')}</span>
                                        <span style={styles.cardPrice}>EUR {ngjarja.cmimiBiletes}</span>
                                    </div>
                                    <button
                                        style={styles.cardBtn}
                                        onClick={() => handleProtectedClick(`/events/${ngjarja.id}`)}
                                    >
                                        Shiko Detajet →
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Komponentet publike - i kalojmë handleProtectedClick */}
            <PublicEkspozitat onProtectedClick={handleProtectedClick} />
            <PublicWorkshopet onProtectedClick={handleProtectedClick} />
            <PublicVepratArtit onProtectedClick={handleProtectedClick} />

            <footer style={styles.footer}>
                <p style={styles.footerText}>© 2025 QendraKulturore. Të gjitha të drejtat e rezervuara.</p>
            </footer>
        </div>
    );
}

const modal = {
    overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    box:         { background: '#fff', padding: '48px 40px', maxWidth: 420, width: '90%', textAlign: 'center', position: 'relative', fontFamily: 'Georgia, serif' },
    icon:        { fontSize: 48, marginBottom: 16 },
    title:       { fontSize: 24, fontWeight: 700, color: '#111', margin: '0 0 16px' },
    desc:        { fontSize: 15, color: '#555', lineHeight: 1.7, margin: '0 0 32px' },
    buttons:     { display: 'flex', gap: 16, justifyContent: 'center' },
    btnLogin:    { background: '#111', color: '#fff', border: 'none', padding: '12px 28px', fontSize: 14, cursor: 'pointer', letterSpacing: 1, fontFamily: 'Georgia, serif' },
    btnRegister: { background: 'none', border: '1px solid #111', color: '#111', padding: '12px 28px', fontSize: 14, cursor: 'pointer', letterSpacing: 1, fontFamily: 'Georgia, serif' },
    btnClose:    { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#888' },
};

const styles = {
    page:         { fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' },
    nav:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #e0e0e0' },
    navLogo:      { fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#111' },
    navLinks:     { display: 'flex', alignItems: 'center', gap: 32 },
    navLink:      { fontSize: 14, color: '#333', cursor: 'pointer', letterSpacing: 1 },
    navBtn:       { background: '#111', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    dashboardBtn: { background: 'none', border: '1px solid #c8a96e', color: '#c8a96e', padding: '8px 16px', fontSize: 13, cursor: 'pointer', letterSpacing: 1, fontWeight: '600' },
    logoutBtn:    { background: '#f44336', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    hero:         { padding: '80px 60px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    heroSub:      { fontSize: 12, letterSpacing: 4, color: '#888', textTransform: 'uppercase', margin: '0 0 16px' },
    heroTitle:    { fontSize: 52, fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.1 },
    heroDesc:     { fontSize: 18, color: '#555', maxWidth: 600, lineHeight: 1.7, margin: 0 },
    section:      { padding: '60px' },
    sectionTitle: { fontSize: 28, fontWeight: 700, color: '#111', margin: '0 0 40px', borderBottom: '2px solid #111', paddingBottom: 16 },
    loading:      { color: '#888', fontSize: 16 },
    error:        { color: '#c00', fontSize: 16 },
    empty:        { color: '#888', fontSize: 16 },
    grid:         { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 },
    card:         { border: '1px solid #e0e0e0', padding: 28, background: '#fff' },
    cardType:     { fontSize: 11, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 12 },
    cardTitle:    { fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 12px', lineHeight: 1.3 },
    cardDesc:     { fontSize: 14, color: '#666', lineHeight: 1.6, margin: '0 0 20px' },
    cardFooter:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    cardDate:     { fontSize: 13, color: '#888' },
    cardPrice:    { fontSize: 16, fontWeight: 700, color: '#111' },
    cardBtn:      { background: 'none', border: '1px solid #111', color: '#111', padding: '8px 16px', fontSize: 13, cursor: 'pointer', width: '100%', letterSpacing: 1 },
    footer:       { borderTop: '1px solid #e0e0e0', padding: '32px 60px', background: '#fafafa' },
    footerText:   { fontSize: 13, color: '#888', margin: 0 },
};