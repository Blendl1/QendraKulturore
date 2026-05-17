import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import apiClient from '../api/apiClient';
import PublicEkspozitat from '../components/PublicEkspozitat';
import PublicVepratArtit from '../components/PublicVepratArtit';
import PublicWorkshopet from '../components/PublicWorkshopet';

export default function Home(){
    const [ngjarjet, setNgjarjet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadNgjarjet();
    }, []);

    const loadNgjarjet = async () => {
        try{
            setLoading(true);
            const res = await apiClient.get('/Ngjarja');
            setNgjarjet(res.data);
        } catch (err) {
            setError('Nuk u ngarkuan ngjarjet. Provoni perseri.');
        }finally{
            setLoading(false);
        }
    }

    return (
        <div style={styles.page}>

            <nav style={styles.nav}>
                <div style={styles.navLogo}>QendraKulturore</div>
                <div style={styles.navLinks}>
                    <span style={styles.navLink}>Ngjarjet</span>
                    <span style={styles.navLink} onClick={() => navigate('/artistet-public')}>Artistët</span>
                    <span style={styles.navLink}>Për Ne</span>
                    <span style={styles.navLink}>Kontakt</span>
                    <button style={styles.navBtn} onClick={() => navigate('/login')}>Hyr</button>
                </div>
            </nav>

            <div style={styles.hero}>
                <p style={styles.heroSub}>Qendra Kulturore</p>
                <h1 style={styles.heroTitle}>Ngjarjet & Aktivitetet</h1>
                <p style={styles.heroDesc}>Zbuloni ngjarjet kulturore, koncertet, shfaqjet teatrore dhe workshopet tona.</p>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Ngjarjet e Ardhshme</h2>

                {loading && <p style={styles.loading}>Duke ngarkuar ngjarjet...</p>}
                {error && <p style={styles.error}>{error}</p>}

                {!loading && !error && (
                    <div style={styles.grid}>
                        {ngjarjet.length === 0 ? (
                            <p style={styles.empty}>Nuk ka ngjarje për momentin.</p>
                        ) : (
                            ngjarjet.map(ngjarja => (
                                <div key={ngjarja.id} style={styles.card} onClick={() => navigate(`/events/${ngjarja.id}`)}>
                                    <div style={styles.cardType}>{ngjarja.lloji}</div>
                                    <h3 style={styles.cardTitle}>{ngjarja.titulli}</h3>
                                    <p style={styles.cardDesc}>{ngjarja.pershkrimi?.slice(0, 100)}...</p>
                                    <div style={styles.cardFooter}>
                                        <span style={styles.cardDate}>{new Date(ngjarja.dataFillimit).toLocaleDateString('sq-AL')}</span>
                                        <span style={styles.cardPrice}>EUR {ngjarja.cmimiBiletes}</span>
                                    </div>
                                    <button style={styles.cardBtn}>Shiko Detajet →</button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <PublicEkspozitat />
            <PublicWorkshopet />
            <PublicVepratArtit />

            <footer style={styles.footer}>
                <p style={styles.footerText}>© 2025 QendraKulturore. Të gjitha të drejtat e rezervuara.</p>
            </footer>
        </div>
    );
}

const styles = {
    page:         { fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' },
    nav:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #e0e0e0' },
    navLogo:      { fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#111' },
    navLinks:     { display: 'flex', alignItems: 'center', gap: 32 },
    navLink:      { fontSize: 14, color: '#333', cursor: 'pointer', letterSpacing: 1 },
    navBtn:       { background: '#111', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
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
    card:         { border: '1px solid #e0e0e0', padding: 28, cursor: 'pointer', background: '#fff' },
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