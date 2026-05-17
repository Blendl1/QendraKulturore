import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ngjarjetApi } from '../api/ngjarjetApi';
import { biletatApi } from '../api/biletatApi';
import Artistet from '../components/Artistet';
import Ekspozitat from '../components/Ekspozitat';
import VepratArtit from '../components/VepratArtit';

function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const onResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return width;
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [ngjarjet, setNgjarjet]   = useState([]);
    const [biletat, setBiletat]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const width    = useWindowWidth();
    const isMobile = width < 768;

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [n, b] = await Promise.all([
                ngjarjetApi.getAll(),
                biletatApi.getAll(),
            ]);
            setNgjarjet(n.data);
            setBiletat(b.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleNav = (page) => {
        setActivePage(page);
        if (isMobile) setSidebarOpen(false);
    };

    const totalRevenue   = biletat.reduce((sum, b) => sum + (b.cmimi || 0), 0);
    const totalAttendees = biletat.length;
    const activeEvents   = ngjarjet.filter(n => n.statusi === 'Aktiv').length;
    const totalEvents    = ngjarjet.length;

    return (
        <div style={styles.page}>

            {/* Hamburger butoni - vetëm mobile */}
            {isMobile && (
                <button
                    style={styles.hamburger}
                    onClick={() => setSidebarOpen(o => !o)}
                    aria-label="Menu"
                >
                    <span style={styles.bar} />
                    <span style={styles.bar} />
                    <span style={styles.bar} />
                </button>
            )}

            {/* Overlay kur sidebar është hapur në mobile */}
            {isMobile && sidebarOpen && (
                <div
                    style={styles.overlay}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div style={{
                ...styles.sidebar,
                transform: isMobile
                    ? sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
                    : 'translateX(0)',
                position: isMobile ? 'fixed' : 'relative',
                zIndex: isMobile ? 100 : 'auto',
                height: isMobile ? '100vh' : 'auto',
            }}>
                <div style={styles.logo}>QendraKulturore</div>
                <nav style={styles.nav}>
                    <button style={activePage === 'dashboard' ? styles.navActive : styles.navBtn} onClick={() => handleNav('dashboard')}>Dashboard</button>
                    <button style={styles.navBtn} onClick={() => { navigate('/ngjarjet'); if(isMobile) setSidebarOpen(false); }}>Ngjarjet</button>
                    <button style={styles.navBtn} onClick={() => { navigate('/biletat'); if(isMobile) setSidebarOpen(false); }}>Biletat</button>
                    <div style={styles.navDivider} />
                    <button style={activePage === 'artistet'   ? styles.navActive : styles.navBtn} onClick={() => handleNav('artistet')}>Artistët</button>
                    <button style={activePage === 'ekspozitat' ? styles.navActive : styles.navBtn} onClick={() => handleNav('ekspozitat')}>Ekspozitat</button>
                    <button style={activePage === 'veprat'     ? styles.navActive : styles.navBtn} onClick={() => handleNav('veprat')}>Veprat e Artit</button>
                </nav>
                <button style={styles.logoutBtn} onClick={handleLogout}>Çkyçu</button>
            </div>

            {/* Main content */}
            <div style={{
                ...styles.main,
                marginLeft: 0,
                padding: isMobile ? '60px 16px 24px' : '32px 40px',
            }}>
                {activePage === 'artistet'   && <Artistet />}
                {activePage === 'ekspozitat' && <Ekspozitat />}
                {activePage === 'veprat'     && <VepratArtit />}

                {activePage === 'dashboard' && (
                    <>
                        <div style={styles.header}>
                            <h1 style={{ ...styles.pageTitle, fontSize: isMobile ? 22 : 28 }}>
                                Dashboard
                            </h1>
                            <span style={styles.welcome}>
                                {!isMobile && `Mirë se vjen, ${user?.fullName || 'Admin'}`}
                            </span>
                        </div>

                        {loading ? (
                            <div style={styles.loading}>Duke ngarkuar...</div>
                        ) : (
                            <>
                                {/* Metric cards */}
                                <div style={{
                                    ...styles.grid4,
                                    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                                }}>
                                    <MetricCard label="Ngjarje Gjithsej"  value={totalEvents}    color="#c8a96e" />
                                    <MetricCard label="Ngjarje Aktive"     value={activeEvents}   color="#4caf50" />
                                    <MetricCard label="Bileta të Shitura"  value={totalAttendees} color="#2196f3" />
                                    <MetricCard label="Të Ardhura (€)"     value={`€${totalRevenue.toLocaleString()}`} color="#9c27b0" />
                                </div>

                                {/* Tabela */}
                                <div style={styles.section}>
                                    <div style={{
                                        ...styles.sectionHeader,
                                        flexDirection: isMobile ? 'column' : 'row',
                                        gap: isMobile ? 12 : 0,
                                        alignItems: isMobile ? 'flex-start' : 'center',
                                    }}>
                                        <h2 style={styles.sectionTitle}>Ngjarjet e Fundit</h2>
                                        <button style={styles.addBtn} onClick={() => navigate('/ngjarjet/create')}>
                                            + Shto Ngjarje
                                        </button>
                                    </div>

                                    {isMobile ? (
                                        /* Kartat në vend të tabelës në mobile */
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {ngjarjet.slice(0, 5).map(n => (
                                                <div key={n.id} style={styles.mobileRow}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{n.titulli}</span>
                                                        <StatusBadge status={n.statusi} />
                                                    </div>
                                                    <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>
                                                        {n.lloji} · {new Date(n.dataFillimit).toLocaleDateString('sq-AL')}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                                                        <span style={{ color: '#c8a96e', fontWeight: 600 }}>€{n.cmimiBiletes}</span>
                                                        <button style={styles.editBtn} onClick={() => navigate(`/ngjarjet/${n.id}`)}>Detajet</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <table style={styles.table}>
                                            <thead>
                                                <tr style={styles.thead}>
                                                    <th style={styles.th}>Titulli</th>
                                                    <th style={styles.th}>Lloji</th>
                                                    <th style={styles.th}>Data</th>
                                                    <th style={styles.th}>Statusi</th>
                                                    <th style={styles.th}>Çmimi</th>
                                                    <th style={styles.th}>Veprime</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ngjarjet.slice(0, 5).map(n => (
                                                    <tr key={n.id} style={styles.tr}>
                                                        <td style={styles.td}>{n.titulli}</td>
                                                        <td style={styles.td}>{n.lloji}</td>
                                                        <td style={styles.td}>{new Date(n.dataFillimit).toLocaleDateString('sq-AL')}</td>
                                                        <td style={styles.td}><StatusBadge status={n.statusi} /></td>
                                                        <td style={styles.td}>€{n.cmimiBiletes?.toLocaleString()}</td>
                                                        <td style={styles.td}>
                                                            <button style={styles.editBtn} onClick={() => navigate(`/ngjarjet/${n.id}`)}>Detajet</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {ngjarjet.length === 0 && (
                                                    <tr><td colSpan={6} style={styles.empty}>Nuk ka ngjarje ende.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function MetricCard({ label, value, color }) {
    return (
        <div style={styles.card}>
            <div style={{ ...styles.cardValue, color }}>{value}</div>
            <div style={styles.cardLabel}>{label}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        Aktiv:       { bg: '#1a3a1a', color: '#4caf50' },
        Planifikuar: { bg: '#1a1a3a', color: '#2196f3' },
        Perfunduar:  { bg: '#2a2a2a', color: '#888'    },
        Anuluar:     { bg: '#3a1a1a', color: '#f44336' },
    };
    const c = colors[status] || colors.Planifikuar;
    return (
        <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
            {status}
        </span>
    );
}

const styles = {
    page:          { display: 'flex', minHeight: '100vh', background: '#0a0a0a', position: 'relative' },
    hamburger:     { position: 'fixed', top: 16, left: 16, zIndex: 200, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5 },
    bar:           { display: 'block', width: 22, height: 2, background: '#fff' },
    overlay:       { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 },
    sidebar:       { width: 220, background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', padding: '24px 0', transition: 'transform 0.25s ease' },
    logo:          { color: '#c8a96e', fontWeight: 700, fontSize: 16, padding: '0 24px 32px' },
    nav:           { display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 },
    navDivider:    { borderTop: '1px solid #222', margin: '8px 0' },
    navBtn:        { background: 'none', border: 'none', color: '#888', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14 },
    navActive:     { background: '#1a1a1a', border: 'none', color: '#fff', padding: '10px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
    logoutBtn:     { background: 'none', border: 'none', color: '#f44336', padding: '10px 24px', textAlign: 'left', cursor: 'pointer', fontSize: 14 },
    main:          { flex: 1, overflowY: 'auto' },
    header:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
    pageTitle:     { color: '#fff', fontWeight: 700, margin: 0 },
    welcome:       { color: '#888', fontSize: 14 },
    loading:       { color: '#888', textAlign: 'center', padding: 40 },
    grid4:         { display: 'grid', gap: 16, marginBottom: 32 },
    card:          { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: '20px' },
    cardValue:     { fontSize: 28, fontWeight: 700, marginBottom: 8 },
    cardLabel:     { color: '#888', fontSize: 13 },
    section:       { background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: 20 },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 20 },
    sectionTitle:  { color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 },
    addBtn:        { background: '#c8a96e', color: '#000', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 },
    table:         { width: '100%', borderCollapse: 'collapse' },
    thead:         { borderBottom: '1px solid #333' },
    th:            { color: '#888', fontSize: 12, fontWeight: 600, padding: '8px 12px', textAlign: 'left', textTransform: 'uppercase' },
    tr:            { borderBottom: '1px solid #1f1f1f' },
    td:            { color: '#ddd', fontSize: 14, padding: '12px' },
    empty:         { color: '#555', textAlign: 'center', padding: 32 },
    editBtn:       { background: '#222', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 },
    mobileRow:     { background: '#222', border: '1px solid #333', borderRadius: 10, padding: '14px' },
};