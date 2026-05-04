import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ngjarja, setNgjarja]   = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [showForm, setShowForm] = useState(false);
    const [bought, setBought]     = useState(false);
    const [form, setForm]         = useState({
        emri: '',
        email: '',
        lloji: 'Standard',
    });

    useEffect(() => {
        loadNgjarja();
    }, [id]);

    const loadNgjarja = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/Ngjarja/${id}`);
            setNgjarja(res.data);
        } catch (err) {
            setError('Ngjarja nuk u gjet.');
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/Bileta', {
                ngjarjaId:   parseInt(id),
                cmimi:       ngjarja.cmimiBiletes,
                lloji:       form.lloji,
                statusi:     'Rezervuar',
                dataBlerjes: new Date().toISOString(),
            });
            setBought(true);
            setShowForm(false);
        } catch (err) {
            setError('Gabim gjatë blerjes së biletës.');
        }
    };

    if (loading) return <div style={styles.center}>Duke ngarkuar...</div>;
    if (error)   return <div style={styles.center}>{error}</div>;
    if (!ngjarja) return <div style={styles.center}>Ngjarja nuk u gjet.</div>;

    return (
        <div style={styles.page}>
            {/* NAVBAR */}
            <nav style={styles.nav}>
                <div 
                    style={styles.navLogo}
                    onClick={() => navigate('/home')}
                >
                    QendraKulturore
                </div>
                <div style={styles.navLinks}>
                    <span 
                        style={styles.navLink}
                        onClick={() => navigate('/home')}
                    >
                        ← Kthehu
                    </span>
                    <button
                        style={styles.navBtn}
                        onClick={() => navigate('/user-login')}
                    >
                        Hyr
                    </button>
                </div>
            </nav>

            {/* EVENT HEADER */}
            <div style={styles.hero}>
                <div style={styles.heroType}>{ngjarja.lloji}</div>
                <h1 style={styles.heroTitle}>{ngjarja.titulli}</h1>
                <div style={styles.heroDates}>
                    <span>
                        {new Date(ngjarja.dataFillimit)
                            .toLocaleDateString('sq-AL', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                    </span>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={styles.content}>
                {/* LEFT — event details */}
                <div style={styles.left}>
                    <h2 style={styles.sectionTitle}>Rreth Ngjarjes</h2>
                    <p style={styles.desc}>{ngjarja.pershkrimi}</p>

                    <div style={styles.infoGrid}>
                        <InfoRow label="Lloji"   value={ngjarja.lloji} />
                        <InfoRow label="Statusi" value={ngjarja.statusi} />
                        <InfoRow label="Salla"   value={`Salla ${ngjarja.sallaId}`} />
                        <InfoRow
                            label="Data e Fillimit"
                            value={new Date(ngjarja.dataFillimit)
                                .toLocaleDateString('sq-AL')}
                        />
                        <InfoRow
                            label="Data e Mbarimit"
                            value={new Date(ngjarja.dataPerfundimit)
                                .toLocaleDateString('sq-AL')}
                        />
                    </div>
                </div>

                {/* RIGHT — ticket box */}
                <div style={styles.right}>
                    <div style={styles.ticketBox}>
                        <div style={styles.ticketPrice}>
                            €{ngjarja.cmimiBiletes}
                        </div>
                        <div style={styles.ticketLabel}>
                            çmimi për biletë
                        </div>

                        {/* Success message */}
                        {bought && (
                            <div style={styles.success}>
                                ✓ Bileta u rezervua me sukses!
                                <br />
                                <small>
                                    Do të kontaktoheni me email.
                                </small>
                            </div>
                        )}

                        {/* Buy button */}
                        {!bought && !showForm && (
                            <button
                                style={styles.buyBtn}
                                onClick={() => setShowForm(true)}
                            >
                                Blej Biletën
                            </button>
                        )}

                        {/* Ticket form */}
                        {showForm && (
                            <form onSubmit={handleBuy} style={styles.form}>
                                <div style={styles.field}>
                                    <label style={styles.label}>
                                        Emri i plotë
                                    </label>
                                    <input
                                        style={styles.input}
                                        value={form.emri}
                                        onChange={e => setForm({
                                            ...form, emri: e.target.value
                                        })}
                                        required
                                        placeholder="Emri Mbiemri"
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>
                                        Email
                                    </label>
                                    <input
                                        style={styles.input}
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({
                                            ...form, email: e.target.value
                                        })}
                                        required
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div style={styles.field}>
                                    <label style={styles.label}>
                                        Lloji i biletës
                                    </label>
                                    <select
                                        style={styles.input}
                                        value={form.lloji}
                                        onChange={e => setForm({
                                            ...form, lloji: e.target.value
                                        })}
                                    >
                                        <option>Standard</option>
                                        <option>VIP</option>
                                        <option>Student</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    style={styles.buyBtn}
                                >
                                    Konfirmo Blerjen — €{ngjarja.cmimiBiletes}
                                </button>

                                <button
                                    type="button"
                                    style={styles.cancelBtn}
                                    onClick={() => setShowForm(false)}
                                >
                                    Anulo
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    © 2025 QendraKulturore. 
                    Të gjitha të drejtat e rezervuara.
                </p>
            </footer>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #e0e0e0'
        }}>
            <span style={{ color: '#888', fontSize: 14 }}>{label}</span>
            <span style={{ color: '#111', fontSize: 14, fontWeight: 600 }}>
                {value}
            </span>
        </div>
    );
}

const styles = {
    page:        { fontFamily: 'Georgia, serif', background: '#fff', minHeight: '100vh' },
    center:      { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#888', fontSize: 18 },

    // Navbar
    nav:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid #e0e0e0' },
    navLogo:     { fontSize: 18, fontWeight: 700, letterSpacing: 2, color: '#111', cursor: 'pointer' },
    navLinks:    { display: 'flex', alignItems: 'center', gap: 32 },
    navLink:     { fontSize: 14, color: '#333', cursor: 'pointer', letterSpacing: 1 },
    navBtn:      { background: '#111', color: '#fff', border: 'none', padding: '8px 20px', fontSize: 13, cursor: 'pointer', letterSpacing: 1 },

    // Hero
    hero:        { padding: '60px 60px 40px', borderBottom: '1px solid #e0e0e0', background: '#fafafa' },
    heroType:    { fontSize: 11, letterSpacing: 4, color: '#888', textTransform: 'uppercase', marginBottom: 16 },
    heroTitle:   { fontSize: 44, fontWeight: 700, color: '#111', margin: '0 0 20px', lineHeight: 1.1 },
    heroDates:   { fontSize: 16, color: '#555' },

    // Content
    content:     { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 60, padding: '60px', maxWidth: 1100, margin: '0 auto' },
    left:        {},
    right:       {},
    sectionTitle:{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 20px' },
    desc:        { fontSize: 16, color: '#444', lineHeight: 1.8, margin: '0 0 40px' },
    infoGrid:    { border: '1px solid #e0e0e0' },

    // Ticket box
    ticketBox:   { border: '1px solid #e0e0e0', padding: 32, position: 'sticky', top: 20 },
    ticketPrice: { fontSize: 48, fontWeight: 700, color: '#111', marginBottom: 4 },
    ticketLabel: { fontSize: 13, color: '#888', marginBottom: 24, letterSpacing: 1 },
    buyBtn:      { width: '100%', background: '#111', color: '#fff', border: 'none', padding: '14px', fontSize: 15, cursor: 'pointer', letterSpacing: 1, marginBottom: 8 },
    cancelBtn:   { width: '100%', background: 'none', color: '#888', border: '1px solid #e0e0e0', padding: '10px', fontSize: 13, cursor: 'pointer' },

    // Form
    form:        { marginTop: 20 },
    field:       { marginBottom: 16 },
    label:       { display: 'block', fontSize: 12, color: '#888', marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' },
    input:       { width: '100%', border: '1px solid #e0e0e0', padding: '10px 12px', fontSize: 14, color: '#111', boxSizing: 'border-box', fontFamily: 'Georgia, serif' },

    // Success
    success:     { background: '#f0f7f0', border: '1px solid #4caf50', color: '#2e7d32', padding: '16px', marginBottom: 16, fontSize: 14, lineHeight: 1.6 },

    // Footer
    footer:      { borderTop: '1px solid #e0e0e0', padding: '32px 60px', background: '#fafafa', marginTop: 60 },
    footerText:  { fontSize: 13, color: '#888', margin: 0 },
};