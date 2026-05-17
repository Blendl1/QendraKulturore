import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import prishtina from '../img/prishtina.jpg';
import { useAuth } from '../context/AuthContext';

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}

export default function PerNe() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const width    = useWindowWidth();
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const sidePad  = isMobile ? '16px' : isTablet ? '32px' : '60px';

    return (
        <div style={styles.page}>

            {/* NAVBAR */}
            <nav style={{ ...styles.nav, padding: `20px ${sidePad}` }}>
                <div style={styles.navLogo} onClick={() => navigate('/home')}>QendraKulturore</div>

                {!isMobile && (
                    <div style={styles.navLinks}>
                        <span style={styles.navLink} onClick={() => navigate('/home')}>Ngjarjet</span>
                        <span style={styles.navLink} onClick={() => navigate('/artistet-public')}>Artistët</span>
                        <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Për Ne</span>
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
                    <span style={styles.mobileLink} onClick={() => navigate('/home')}>Ngjarjet</span>
                    <span style={styles.mobileLink} onClick={() => { navigate('/artistet-public'); setMenuOpen(false); }}>Artistët</span>
                    <span style={styles.mobileLink}>Për Ne</span>
                    <span style={styles.mobileLink} onClick={() => navigate('/kontakt')}>Kontakt</span>
                    {!user ? (
                        <button style={{ ...styles.navBtn, width: '100%', marginTop: 8 }} onClick={() => navigate('/login')}>Hyr</button>
                    ) : (
                        <>
                            {user.roles?.includes('Admin') && (
                                <button style={{ ...styles.dashboardBtn, width: '100%', marginTop: 8 }} onClick={() => navigate('/dashboard')}>Dashboard</button>
                            )}
                            <button style={{ ...styles.logoutBtn, width: '100%', marginTop: 8 }} onClick={logout}>Dil</button>
                        </>
                    )}
                </div>
            )}

            {/* HERO */}
            <div style={{ ...styles.hero, padding: isMobile ? '40px 16px' : isTablet ? '60px 32px' : '80px 60px' }}>
                <p style={styles.heroSub}>Rreth Nesh</p>
                <h1 style={{ ...styles.heroTitle, fontSize: isMobile ? 28 : isTablet ? 42 : 52 }}>Për Ne</h1>
                <p style={{ ...styles.heroDesc, fontSize: isMobile ? 14 : 18 }}>
                    Qendra Kulturore e Prishtinës — vendi ku arti, kultura dhe komuniteti takohen.
                </p>
            </div>

            {/* IMAZHI + TEKSTI */}
            <div style={{
                ...styles.section,
                padding: isMobile ? '40px 16px' : isTablet ? '48px 32px' : '64px 60px',
                flexDirection: isMobile ? 'column' : 'row',
            }}>
                <div style={{ flex: 1, marginRight: isMobile ? 0 : 48, marginBottom: isMobile ? 32 : 0 }}>
                    <img src={prishtina} alt="Prishtina" style={{ width: '100%', height: isMobile ? 220 : 380, objectFit: 'cover', border: '1px solid #e0e0e0' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={styles.label}>Historia Jonë</p>
                    <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? 22 : 30 }}>
                        Një hapësirë për kulturën e Prishtinës
                    </h2>
                    <p style={{ ...styles.text, fontSize: isMobile ? 14 : 16 }}>
                        Qendra Kulturore u themelua me vizionin për të krijuar një hapësirë gjithëpërfshirëse
                        ku artistët, muzikantët, aktorët dhe krijuesit mund të shprehin talentin e tyre.
                    </p>
                    <p style={{ ...styles.text, fontSize: isMobile ? 14 : 16 }}>
                        Me kalimin e viteve, jemi bërë një nga vendet më të rëndësishme kulturore
                        në Prishtinë, duke organizuar qindra ngjarje, ekspozita dhe workshope
                        që kanë bashkuar komunitetin tonë.
                    </p>
                </div>
            </div>

            {/* STATISTIKAT */}
            <div style={{ ...styles.statsSection, padding: isMobile ? '40px 16px' : '48px 60px', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)' }}>
                <StatCard number="500+" label="Ngjarje të Organizuara" />
                <StatCard number="200+" label="Artistë të Bashkëpunuar" />
                <StatCard number="50+"  label="Workshope në Vit" />
                <StatCard number="10K+" label="Vizitorë Çdo Vit" />
            </div>

            {/* MISIONI */}
            <div style={{ ...styles.missionSection, padding: isMobile ? '40px 16px' : isTablet ? '48px 32px' : '64px 60px' }}>
                <p style={styles.label}>Misioni Ynë</p>
                <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? 22 : 30, maxWidth: 600 }}>
                    Të promovojmë artin dhe kulturën shqiptare
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 20 : 32, marginTop: 40 }}>
                    <MisionCard icon="🎭" title="Arte Skenike"    desc="Teatër, muzikë dhe performanca live që frymëzojnë dhe argëtojnë audiencën tonë." />
                    <MisionCard icon="🖼️" title="Arte Vizuale"    desc="Ekspozita dhe galeri që prezantojnë artin bashkëkohor shqiptar dhe ndërkombëtar." />
                    <MisionCard icon="📚" title="Edukim Kulturor" desc="Workshope dhe programe edukative për të gjitha moshat dhe nivelet." />
                </div>
            </div>

            {/* CTA */}
            <div style={{ ...styles.cta, padding: isMobile ? '40px 16px' : '60px' }}>
                <h2 style={{ ...styles.ctaTitle, fontSize: isMobile ? 22 : 32 }}>Bashkohuni me ne sot</h2>
                <p style={{ ...styles.ctaDesc, fontSize: isMobile ? 14 : 16 }}>
                    Zbuloni ngjarjet tona të ardhshme dhe bëhuni pjesë e komunitetit kulturor.
                </p>
                <button style={styles.ctaBtn} onClick={() => navigate('/home')}>Shiko Ngjarjet →</button>
            </div>

            <footer style={{ ...styles.footer, padding: `32px ${sidePad}` }}>
                <p style={styles.footerText}>© 2025 QendraKulturore. Të gjitha të drejtat e rezervuara.</p>
            </footer>
        </div>
    );
}

function StatCard({ number, label }) {
    return (
        <div style={styles.statCard}>
            <div style={styles.statNumber}>{number}</div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    );
}

function MisionCard({ icon, title, desc }) {
    return (
        <div style={styles.misionCard}>
            <div style={styles.misionIcon}>{icon}</div>
            <h3 style={styles.misionTitle}>{title}</h3>
            <p style={styles.misionDesc}>{desc}</p>
        </div>
    );
}

const styles = {
    page:           { fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' },
    nav:            { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' },
    navLogo:        { fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#111', cursor: 'pointer' },
    navLinks:       { display: 'flex', alignItems: 'center', gap: 32 },
    navLink:        { fontSize: 14, color: '#333', cursor: 'pointer', letterSpacing: 1 },
    navLinkActive:  { borderBottom: '2px solid #111', paddingBottom: 2 },
    navBtn:         { background: '#111', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    dashboardBtn:   { background: 'none', border: '1px solid #c8a96e', color: '#c8a96e', padding: '8px 16px', fontSize: 13, cursor: 'pointer', letterSpacing: 1, fontWeight: '600' },
    logoutBtn:      { background: '#f44336', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    hamburger:      { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 },
    bar:            { display: 'block', width: 24, height: 2, background: '#111' },
    mobileMenu:     { display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    mobileLink:     { fontSize: 15, color: '#333', cursor: 'pointer', letterSpacing: 1, padding: '4px 0' },
    hero:           { borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    heroSub:        { fontSize: 12, letterSpacing: 4, color: '#888', textTransform: 'uppercase', margin: '0 0 16px' },
    heroTitle:      { fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.1 },
    heroDesc:       { color: '#555', maxWidth: 600, lineHeight: 1.7, margin: 0 },
    section:        { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0' },
    label:          { fontSize: 11, letterSpacing: 4, color: '#888', textTransform: 'uppercase', margin: '0 0 16px' },
    sectionTitle:   { fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.2 },
    text:           { color: '#555', lineHeight: 1.8, margin: '0 0 16px' },
    statsSection:   { display: 'grid', gap: 1, background: '#e0e0e0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' },
    statCard:       { background: '#fff', padding: '32px 24px', textAlign: 'center' },
    statNumber:     { fontSize: 36, fontWeight: 700, color: '#111', marginBottom: 8 },
    statLabel:      { fontSize: 13, color: '#888', letterSpacing: 1 },
    missionSection: { borderBottom: '1px solid #e0e0e0' },
    misionCard:     { border: '1px solid #e0e0e0', padding: 28 },
    misionIcon:     { fontSize: 32, marginBottom: 16 },
    misionTitle:    { fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 12px' },
    misionDesc:     { fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 },
    cta:            { background: '#111', textAlign: 'center' },
    ctaTitle:       { fontWeight: 700, color: '#fff', margin: '0 0 16px' },
    ctaDesc:        { color: '#888', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 },
    ctaBtn:         { background: '#fff', color: '#111', border: 'none', padding: '12px 32px', fontSize: 14, cursor: 'pointer', letterSpacing: 1, fontFamily: 'Georgia, serif' },
    footer:         { borderTop: '1px solid #e0e0e0', background: '#fafafa' },
    footerText:     { fontSize: 13, color: '#888', margin: 0 },
};