import React, { useEffect, useState } from "react";
import ArtistList from "../components/Klienti/ArtistList";
import EkspozitatOrari from "../components/Klienti/Ekspozitat_Orari";
import Gallery from "../components/Klienti/Gallery";

import hero1 from "../img/fotografi.jpg";
import hero2 from "../img/Academic.png";
import hero3 from "../img/skulpture.jpg";

const slides = [
  {
    id: 1,
    image: hero1,
    eyebrow: "Qendra Kulturore",
    title: "Një hapësirë e dedikuar për artin, ekspozitat dhe identitetin krijues",
    text: "Qendra Kulturore ofron një prezantim të organizuar të artistëve, veprave të artit dhe ekspozitave bashkëkohore, duke krijuar një përvojë të qartë, estetike dhe funksionale për çdo vizitor.",
    primary: "#artistet",
    primaryText: "Shiko artistët",
    secondary: "#ekspozitat",
    secondaryText: "Shiko ekspozitat",
  },
  {
    id: 2,
    image: hero2,
    eyebrow: "Ekspozita të kuruara",
    title: "Prezantim profesional i programeve ekspozuese dhe përmbajtjes artistike",
    text: "Çdo ekspozitë paraqitet me informacion të saktë për datën, sallën dhe veprat pjesëmarrëse, në mënyrë që vizitori të ketë një pamje të plotë dhe të lehtë për t’u ndjekur.",
    primary: "#ekspozitat",
    primaryText: "Programi i ekspozitave",
    secondary: "#galeria",
    secondaryText: "Shiko galerinë",
  },
  {
    id: 3,
    image: hero3,
    eyebrow: "Artistë dhe vepra",
    title: "Profile artistësh dhe vepra të paraqitura me qartësi dhe kujdes estetik",
    text: "Platforma ofron profile të detajuara të artistëve dhe informacion të strukturuar për veprat, duke ndërtuar një komunikim më profesional dhe më të afërt me publikun.",
    primary: "#artistet",
    primaryText: "Zbulo artistët",
    secondary: "#home",
    secondaryText: "Kthehu lart",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const activeSlide = slides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <main>
      <section
        className="hero-section"
        id="home"
        style={{ backgroundImage: `url(${activeSlide.image})` }}
      >
        <div className="container hero-grid">
          <div className="hero-copy fade-in-up">
            <span className="eyebrow">{activeSlide.eyebrow}</span>
            <h1>{activeSlide.title}</h1>
            <p>{activeSlide.text}</p>

            <div className="hero-actions">
              <a className="primary-btn" href={activeSlide.primary}>
                {activeSlide.primaryText}
              </a>
              <a className="secondary-btn" href={activeSlide.secondary}>
                {activeSlide.secondaryText}
              </a>
            </div>

            <div className="hero-slider-nav">
              <div className="slider-controls">
                <button onClick={prevSlide} aria-label="Slide previous">
                  ‹
                </button>
                <button onClick={nextSlide} aria-label="Slide next">
                  ›
                </button>
              </div>

              <div className="slider-dots">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    className={index === currentSlide ? "dot active" : "dot"}
                    onClick={() => goToSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hero-panel fade-in-up">
            <div className="hero-card large">
              <span className="hero-label">Përmbajtje e organizuar</span>
              <h3>Një prezantim i qartë dhe profesional për publikun</h3>
              <p>
                Website-i është ndërtuar për të paraqitur aktivitetin kulturor në
                mënyrë të strukturuar, duke ruajtur qartësinë vizuale dhe seriozitetin
                institucional.
              </p>
            </div>

            <div className="hero-card-row">
              <div className="hero-card small">
                <span className="hero-label">Artistët</span>
                <h3>Profile të plota</h3>
                <p>
                  Biografi, specializim dhe veprat e secilit artist në një formë të
                  organizuar dhe të kuptueshme.
                </p>
              </div>

              <div className="hero-card small">
                <span className="hero-label">Ekspozitat</span>
                <h3>Planifikim i qartë</h3>
                <p>
                  Informacion i detajuar për ekspozitat, sallat dhe datat e zhvillimit
                  të tyre.
                </p>
              </div>

              <div className="hero-card small">
                <span className="hero-label">Galeria</span>
                <h3>Vepra të dokumentuara</h3>
                <p>
                  Paraqitje e veprave me materialin, vitin dhe vlerën përkatëse në një
                  strukturë profesionale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <div className="container intro-strip-grid">
          <div>
            <span className="section-tag">Rreth platformës</span>
            <h2>Prezantim i strukturuar dhe i qartë i aktivitetit kulturor</h2>
          </div>
          <p>
            Kjo platformë është krijuar për t’i dhënë vizitorit një qasje të thjeshtë
            dhe të rregullt në informacionin mbi artistët, ekspozitat dhe veprat e
            artit, duke e bërë përvojën më të lehtë për t’u ndjekur dhe më të besueshme.
          </p>
        </div>
      </section>

      <ArtistList />
      <EkspozitatOrari />
      <Gallery />
    </main>
  );
}