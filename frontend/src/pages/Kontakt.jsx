import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

export default function Kontakt() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [form, setForm]       = useState({ emri: '', email: '', subjekti: '', mesazhi: '' });
    const [derguar, setDerguar] = useState(false);
    const width    = useWindowWidth();
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;
    const sidePad  = isMobile ? '16px' : isTablet ? '32px' : '60px';

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); setDerguar(true); };

    return (
        <div style={styles.page}>

            {/* NAVBAR */}
            <nav style={{ ...styles.nav, padding: `20px ${sidePad}` }}>
                <div style={styles.navLogo} onClick={() => navigate('/home')}>QendraKulturore</div>

                {!isMobile && (
                    <div style={styles.navLinks}>
                        <span style={styles.navLink} onClick={() => navigate('/home')}>Ngjarjet</span>
                        <span style={styles.navLink} onClick={() => navigate('/artistet-public')}>Artistët</span>
                        <span style={styles.navLink} onClick={() => navigate('/per-ne')}>Për Ne</span>
                        <span style={{ ...styles.navLink, ...styles.navLinkActive }}>Kontakt</span>

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
                    <span style={styles.mobileLink} onClick={() => navigate('/per-ne')}>Për Ne</span>
                    <span style={styles.mobileLink}>Kontakt</span>
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
                <p style={styles.heroSub}>Na Kontaktoni</p>
                <h1 style={{ ...styles.heroTitle, fontSize: isMobile ? 28 : isTablet ? 42 : 52 }}>Kontakt</h1>
                <p style={{ ...styles.heroDesc, fontSize: isMobile ? 14 : 18 }}>
                    Jemi këtu për çdo pyetje, sugjerim ose bashkëpunim. Na shkruani!
                </p>
            </div>

            {/* KONTAKT CONTENT */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 32 : 60,
                padding: isMobile ? '40px 16px' : isTablet ? '48px 32px' : '70px 60px',
                borderBottom: '1px solid #e0e0e0',
            }}>
                {/* INFO */}
                <div style={{ flex: 1 }}>
                    <p style={styles.label}>Informacioni</p>
                    <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? 22 : 28 }}>Na gjeni këtu</h2>
                    <div style={styles.infoList}>
                        <InfoItem icon="📍" title="Adresa"   value="Rr. Nënë Tereza, Prishtinë, Kosovë" />
                        <InfoItem icon="📞" title="Telefoni" value="+383 44 123 456" />
                        <InfoItem icon="✉️" title="Email"    value="info@qendrakulturore.com" />
                        <InfoItem icon="🕐" title="Orari"    value={`E Hënë – E Premte: 09:00 – 20:00\nE Shtunë – E Diel: 10:00 – 18:00`} />
                    </div>
                    <div style={{ marginTop: 32 }}>
                        <p style={styles.label}>Na Ndiqni</p>
                        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                            <SocialBtn label="Facebook" />
                            <SocialBtn label="Instagram" />
                            <SocialBtn label="YouTube" />
                        </div>
                    </div>
                </div>

                {/* FORMA */}
                <div style={{ flex: 1.2 }}>
                    <p style={styles.label}>Dërgoni Mesazh</p>
                    <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? 22 : 28 }}>Na shkruani</h2>

                    {derguar ? (
                        <div style={styles.successBox}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                            <h3 style={{ color: '#111', margin: '0 0 8px' }}>Mesazhi u dërgua!</h3>
                            <p style={{ color: '#555', margin: 0 }}>Do t'ju kontaktojmë së shpejti.</p>
                            <button style={{ ...styles.submitBtn, marginTop: 24 }} onClick={() => setDerguar(false)}>
                                Dërgo Mesazh Tjetër
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={styles.formLabel}>Emri & Mbiemri</label>
                                    <input style={styles.input} type="text" name="emri" placeholder="p.sh. Arbër Gashi" value={form.emri} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={styles.formLabel}>Email</label>
                                    <input style={styles.input} type="email" name="email" placeholder="email@shembull.com" value={form.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={styles.formLabel}>Subjekti</label>
                                <input style={styles.input} type="text" name="subjekti" placeholder="Çfarë dëshironi të na tregoni?" value={form.subjekti} onChange={handleChange} />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <label style={styles.formLabel}>Mesazhi</label>
                                <textarea style={{ ...styles.input, height: 160, resize: 'vertical' }} name="mesazhi" placeholder="Shkruani mesazhin tuaj këtu..." value={form.mesazhi} onChange={handleChange} />
                            </div>
                            <button
                                type="submit"
                                style={{ ...styles.submitBtn, opacity: (!form.emri || !form.email || !form.mesazhi) ? 0.5 : 1, cursor: (!form.emri || !form.email || !form.mesazhi) ? 'not-allowed' : 'pointer' }}
                                disabled={!form.emri || !form.email || !form.mesazhi}
                            >
                                Dërgo Mesazhin →
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* HARTA */}
            <div style={{ padding: isMobile ? '40px 16px' : '64px 60px', borderBottom: '1px solid #e0e0e0' }}>
                <p style={styles.label}>Vendndodhja</p>
                <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? 22 : 28 }}>Na gjeni në hartë</h2>
                <div style={styles.mapContainer}>
                    <iframe
                        title="Qendra Kulturore Location"
                        src="https://www.google.com/maps?q=Rr.+Nene+Tereza,+Prishtine,+Kosove&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>

            <footer style={{ ...styles.footer, padding: `32px ${sidePad}` }}>
                <p style={styles.footerText}>© 2025 QendraKulturore. Të gjitha të drejtat e rezervuara.</p>
            </footer>
        </div>
    );
}

function InfoItem({ icon, title, value }) {
    return (
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
            <div style={{ fontSize: 22, marginTop: 2 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 12, letterSpacing: 2, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 15, color: '#111', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{value}</div>
            </div>
        </div>
    );
}

function SocialBtn({ label }) {
    return (
        <button style={{ background: 'none', border: '1px solid #111', color: '#111', padding: '6px 16px', fontSize: 12, cursor: 'pointer', letterSpacing: 1, fontFamily: 'Georgia, serif' }}>
            {label}
        </button>
    );
}

const styles = {
    page:          { fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' },
    nav:           { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' },
    navLogo:       { fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#111', cursor: 'pointer' },
    navLinks:      { display: 'flex', alignItems: 'center', gap: 32 },
    navLink:       { fontSize: 14, color: '#333', cursor: 'pointer', letterSpacing: 1 },
    navLinkActive: { borderBottom: '2px solid #111', paddingBottom: 2 },
    navBtn:        { background: '#111', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    dashboardBtn:  { background: 'none', border: '1px solid #c8a96e', color: '#c8a96e', padding: '8px 16px', fontSize: 13, cursor: 'pointer', letterSpacing: 1, fontWeight: '600' },
    logoutBtn:     { background: '#f44336', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },
    hamburger:     { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 },
    bar:           { display: 'block', width: 24, height: 2, background: '#111' },
    mobileMenu:    { display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    mobileLink:    { fontSize: 15, color: '#333', cursor: 'pointer', letterSpacing: 1, padding: '4px 0' },
    hero:          { borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    heroSub:       { fontSize: 12, letterSpacing: 4, color: '#888', textTransform: 'uppercase', margin: '0 0 16px' },
    heroTitle:     { fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.1 },
    heroDesc:      { color: '#555', maxWidth: 600, lineHeight: 1.7, margin: 0 },
    label:         { fontSize: 11, letterSpacing: 4, color: '#888', textTransform: 'uppercase', margin: '0 0 16px' },
    sectionTitle:  { fontWeight: 700, color: '#111', margin: '0 0 28px', lineHeight: 1.2 },
    infoList:      { marginTop: 8 },
    formLabel:     { display: 'block', fontSize: 12, letterSpacing: 1, color: '#888', textTransform: 'uppercase', marginBottom: 8 },
    input:         { width: '100%', border: '1px solid #ddd', padding: '14px 16px', fontSize: 14, fontFamily: 'Georgia, serif', color: '#111', outline: 'none', boxSizing: 'border-box', background: '#fafafa' },
    submitBtn:     { background: '#111', color: '#fff', border: 'none', padding: '14px 28px', fontSize: 13, cursor: 'pointer', letterSpacing: 1, fontFamily: 'Georgia, serif', width: '100%' },
    successBox:    { border: '1px solid #e0e0e0', padding: 40, textAlign: 'center', background: '#fafafa' },
    mapContainer:  { width: '100%', height: 400, border: '1px solid #ddd', marginTop: 20, overflow: 'hidden' },
    footer:        { borderTop: '1px solid #e0e0e0', background: '#fafafa' },
    footerText:    { fontSize: 13, color: '#888', margin: 0 },
};