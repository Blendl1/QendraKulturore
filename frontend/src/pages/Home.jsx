import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import PublicEkspozitat from '../components/PublicEkspozitat';
import PublicVepratArtit from '../components/PublicVepratArtit';
import PublicWorkshopet from '../components/PublicWorkshopet';

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}

export default function Home() {
    const [ngjarjet, setNgjarjet] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate                = useNavigate();
    const width                   = useWindowWidth();

    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    const sidePad  = isMobile ? '16px' : isTablet ? '32px' : '60px';
    const gridCols = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)';

    useEffect(() => { loadNgjarjet(); }, []);

    const loadNgjarjet = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/Ngjarja');
            setNgjarjet(res.data);
        } catch {
            setError('Nuk u ngarkuan ngjarjet. Provoni perseri.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            {/* NAVBAR */}
            <nav style={{ ...styles.nav, padding: `20px ${sidePad}` }}>
                <div style={styles.navLogo}>QendraKulturore</div>

                {!isMobile && (
                    <div style={styles.navLinks}>
                        <span style={styles.navLink}>Ngjarjet</span>
                        <span style={styles.navLink} onClick={() => navigate('/artistet-public')}>Artistët</span>
                        <span style={styles.navLink}>Për Ne</span>
                        <span style={styles.navLink}>Kontakt</span>
                        <button style={styles.navBtn} onClick={() => navigate('/login')}>Hyr</button>
                    </div>
                )}

                {isMobile && (
                    <button onClick={() => setMenuOpen(o => !o)} style={styles.hamburger} aria-label="Menu">
                        <span style={styles.bar} />
                        <span style={styles.bar} />
                        <span style={styles.bar} />
                    </button>
                )}
            </nav>

            {/* MOBILE MENU */}
            {isMobile && menuOpen && (
                <div style={styles.mobileMenu}>
                    <span style={styles.mobileLink}>Ngjarjet</span>
                    <span style={styles.mobileLink} onClick={() => { navigate('/artistet-public'); setMenuOpen(false); }}>Artistët</span>
                    <span style={styles.mobileLink}>Për Ne</span>
                    <span style={styles.mobileLink}>Kontakt</span>
                    <button style={{ ...styles.navBtn, width: '100%', marginTop: 8 }} onClick={() => navigate('/login')}>Hyr</button>
                </div>
            )}

            {/* HERO */}
            <div style={{
                ...styles.hero,
                padding: isMobile ? '40px 16px' : isTablet ? '60px 32px' : '80px 60px',
            }}>
                <p style={styles.heroSub}>Qendra Kulturore</p>
                <h1 style={{
                    ...styles.heroTitle,
                    fontSize: isMobile ? 28 : isTablet ? 42 : 52,
                }}>
                    Ngjarjet & Aktivitetet
                </h1>
                <p style={{
                    ...styles.heroDesc,
                    fontSize: isMobile ? 14 : 18,
                }}>
                    Zbuloni ngjarjet kulturore, koncertet,
                    shfaqjet teatrore dhe workshopet tona.
                </p>
            </div>

            {/* NGJARJET */}
            <div style={{ padding: `48px ${sidePad}` }}>
                <h2 style={{
                    ...styles.sectionTitle,
                    fontSize: isMobile ? 22 : 28,
                }}>
                    Ngjarjet e Ardhshme
                </h2>

                {loading && <p style={styles.loading}>Duke ngarkuar ngjarjet...</p>}
                {error   && <p style={styles.error}>{error}</p>}

                {!loading && !error && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: gridCols,
                        gap: isMobile ? 16 : 24,
                    }}>
                        {ngjarjet.length === 0 ? (
                            <p style={styles.empty}>Nuk ka ngjarje për momentin.</p>
                        ) : (
                            ngjarjet.map(ngjarja => (
                                <div
                                    key={ngjarja.id}
                                    style={styles.card}
                                    onClick={() => navigate(`/events/${ngjarja.id}`)}
                                >
                                    <div style={styles.cardType}>{ngjarja.lloji}</div>
                                    <h3 style={styles.cardTitle}>{ngjarja.titulli}</h3>
                                    <p style={styles.cardDesc}>{ngjarja.pershkrimi?.slice(0, 80)}...</p>
                                    <div style={styles.cardFooter}>
                                        <span style={styles.cardDate}>
                                            {new Date(ngjarja.dataFillimit).toLocaleDateString('sq-AL')}
                                        </span>
                                        <span style={styles.cardPrice}>EUR {ngjarja.cmimiBiletes}</span>
                                    </div>
                                    <button style={styles.cardBtn}>Shiko Detajet →</button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* PUBLIC EKSPOZITAT */}
            <PublicEkspozitat />

            {/* PUBLIC WORKSHOPET */}
            <PublicWorkshopet />

            {/* PUBLIC VEPRAT E ARTIT */}
            <PublicVepratArtit />

            {/* FOOTER */}
            <footer style={{ ...styles.footer, padding: `32px ${sidePad}` }}>
                <p style={styles.footerText}>© 2025 QendraKulturore. Të gjitha të drejtat e rezervuara.</p>
            </footer>
        </div>
    );
}

const styles = {
    page:         { fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' },

    nav:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' },
    navLogo:      { fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#111' },
    navLinks:     { display: 'flex', alignItems: 'center', gap: 32 },
    navLink:      { fontSize: 14, color: '#333', cursor: 'pointer', letterSpacing: 1 },
    navBtn:       { background: '#111', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },

    hamburger:    { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 },
    bar:          { display: 'block', width: 24, height: 2, background: '#111' },

    mobileMenu:   { display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    mobileLink:   { fontSize: 15, color: '#333', cursor: 'pointer', letterSpacing: 1, padding: '4px 0' },

    hero:         { borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    heroSub:      { fontSize: 12, letterSpacing: 4, color: '#888', textTransform: 'uppercase', margin: '0 0 16px' },
    heroTitle:    { fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.1 },
    heroDesc:     { color: '#555', maxWidth: 600, lineHeight: 1.7, margin: 0 },

    sectionTitle: { fontWeight: 700, color: '#111', margin: '0 0 32px', borderBottom: '2px solid #111', paddingBottom: 16 },
    loading:      { color: '#888', fontSize: 16 },
    error:        { color: '#c00', fontSize: 16 },
    empty:        { color: '#888', fontSize: 16 },

    card:         { border: '1px solid #e0e0e0', padding: 20, cursor: 'pointer', background: '#fff' },
    cardType:     { fontSize: 11, letterSpacing: 3, color: '#888', textTransform: 'uppercase', marginBottom: 10 },
    cardTitle:    { fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 10px', lineHeight: 1.3 },
    cardDesc:     { fontSize: 13, color: '#666', lineHeight: 1.6, margin: '0 0 16px' },
    cardFooter:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardDate:     { fontSize: 12, color: '#888' },
    cardPrice:    { fontSize: 15, fontWeight: 700, color: '#111' },
    cardBtn:      { background: 'none', border: '1px solid #111', color: '#111', padding: '8px 16px', fontSize: 12, cursor: 'pointer', width: '100%', letterSpacing: 1 },

    footer:       { borderTop: '1px solid #e0e0e0', background: '#fafafa' },
    footerText:   { fontSize: 13, color: '#888', margin: 0 },
};