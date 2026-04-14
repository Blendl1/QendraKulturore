import React, { useEffect, useState } from 'react';

import artsImg from '../img/pikture.png';
import academicImg from '../img/Academic.png';
import grafikeImg from '../img/grafike.jpg';
import art_digjitalImg from '../img/art_digjital.jpg';
import skulptureImg from '../img/skulpture.jpg';
import fotografiImg from '../img/fotografi.jpg';

function Artistet() {
    const [artistet, setArtistet] = useState([]);
    const [formData, setFormData] = useState({ emri: '', mbiemri: '', specializimi: '', shteti: '' });

    const backgroundMap = {
        'Pikturë': artsImg,
        'Skulpturë': skulptureImg,
        'Fotografi': fotografiImg, 
        'Grafikë': grafikeImg,
        'Art Digjital': art_digjitalImg
    };

    const pageBackground = backgroundMap[formData.specializimi] || artsImg;

    const fetchArtists = () => {
        fetch('http://localhost:5002/api/Artistet')
            .then(res => res.json())
            .then(data => setArtistet(data))
            .catch(err => console.error("Error gjatë marrjes së të dhënave:", err));
    };

    useEffect(() => { 
        fetchArtists(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.emri.trim() || !formData.mbiemri.trim()) {
            alert("Ju lutem plotësoni Emrin dhe Mbiemrin para se të shtoni artistin.");
            return;
        }

        try {
            await fetch('http://localhost:5002/api/Artistet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setFormData({ emri: '', mbiemri: '', specializimi: '', shteti: '' });
            fetchArtists(); // Rifreskon listën
        } catch (error) {
            console.error("Gabim gjatë shtimit:", error);
        }
    };

    const deleteArtisti = async (id) => {
        if (window.confirm("A jeni i sigurt që dëshironi të fshini këtë profil?")) {
            try {
                await fetch(`http://localhost:5002/api/Artistet/${id}`, { method: 'DELETE' });
                fetchArtists();
            } catch (error) {
                console.error("Gabim gjatë fshirjes:", error);
            }
        }
    };

    return (
        <div className="page-container" style={{ 
            backgroundImage: `linear-gradient(rgba(248, 249, 252, 0.9), rgba(248, 249, 252, 0.9)), url(${pageBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            transition: 'background-image 0.8s ease-in-out',
            width: '100%'
        }}>
            <div className="form-container">
                <h2>Regjistrimi i Artistit</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        placeholder="Emri" 
                        value={formData.emri} 
                        onChange={e => setFormData({...formData, emri: e.target.value})} 
                    />
                    <input 
                        placeholder="Mbiemri" 
                        value={formData.mbiemri} 
                        onChange={e => setFormData({...formData, mbiemri: e.target.value})} 
                    />
                    <select 
                        value={formData.specializimi} 
                        onChange={e => setFormData({...formData, specializimi: e.target.value})}
                    >
                        <option value="">Zgjidh Specializimin</option>
                        <option value="Pikturë">Pikturë</option>
                        <option value="Skulpturë">Skulpturë</option>
                        <option value="Fotografi">Fotografi</option>
                        <option value="Grafikë">Grafikë</option>
                        <option value="Art Digjital">Art Digjital</option>
                    </select>
                    <input 
                        placeholder="Shteti" 
                        value={formData.shteti} 
                        onChange={e => setFormData({...formData, shteti: e.target.value})} 
                    />
                    <button type="submit" style={{ color: 'white' }}>Shto Artist</button>
                </form>
            </div>

            <div className="flex-list">
                {artistet
                    .filter(a => a.emri && a.emri.trim() !== "")
                    .map(a => {
                        const artistPhoto = backgroundMap[a.specializimi] || artsImg;

                        return (
                            <div key={a.id} className="flex-card">
                                <img 
                                    src={artistPhoto} 
                                    alt="Specializimi" 
                                    className="card-image"
                                />
                                
                                <div className="badge">Artist</div>
                                <h3>{a.emri} {a.mbiemri}</h3>
                                <p><span>🎨</span> <strong>{a.specializimi || "I pa përcaktuar"}</strong></p>
                                <p><span>📍</span> {a.shteti || "Lokacion i panjohur"}</p>
                                
                                <button 
                                    className="btn-delete"
                                    onClick={() => deleteArtisti(a.id)} 
                                    style={{ color: 'white', marginTop: 'auto' }}
                                >
                                    Fshi Profilin
                                </button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Artistet;