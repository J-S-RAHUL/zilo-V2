import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleHeroLoginBanner } from '../components/GoogleHeroLoginBanner';
import { POPULAR_LOCATIONS } from '../utils/distance';
import {
  Search,
  MapPin,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';

interface HomeViewProps {
  onOpenAiModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenAiModal }) => {
  const {
    setCurrentView,
    searchQuery,
    setSearchQuery,
    currentLocation,
    setCurrentLocation
  } = useApp();

  const [selectedCity, setSelectedCity] = useState(currentLocation.name);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('find-workers');
  };

  const popularSearches = [
    'Extra Hands',
    'Plumber',
    'Carpenter',
    'AC Service',
    'Lift Worker',
    'Electrician',
    'Tutoring'
  ];

  return (
    <div className="zilo-landing-page">
      {/* ==================================================
          1. HERO SECTION
          ================================================== */}
      <section className="zilo-hero-section">
        {/* Subtle geometric lines & background accents */}
        <div className="hero-bg-shapes">
          <div className="hero-shape-polygon" />
          <div className="hero-shape-dots" />
          <div className="hero-shape-circle" />
        </div>

        <div className="container hero-layout-grid">
          {/* Hero Left: Headlines & Integrated Search Bar */}
          <div className="hero-left-col">
            <h1 className="hero-main-headline">
              Find the Right Worker.
              <br />
              Find the <span className="headline-highlight">
                Right Job.
                <svg className="brush-underline-svg" viewBox="0 0 250 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13C60 4 175 2 247 11C205 16 110 18 3 13Z" fill="#3B49DF" opacity="0.85" />
                </svg>
              </span>
            </h1>

            <p className="hero-subheading">
              Connect directly with skilled service businesses and free-time helpers near you with zero middlemen.
            </p>

            {/* Integrated Large Search Area */}
            <form onSubmit={handleSearchSubmit} className="hero-search-container">
              {/* Search workers or jobs input */}
              <div className="search-input-unit">
                <Search size={20} className="search-box-icon" />
                <input
                  type="text"
                  className="search-text-field"
                  placeholder="Search Extra Hands, Plumber, AC Service, Electrician..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="search-box-divider" />

              {/* Select Location Dropdown */}
              <div className="search-location-unit">
                <MapPin size={18} className="location-box-icon" />
                <select
                  className="search-location-select"
                  value={selectedCity}
                  onChange={(e) => {
                    const found = POPULAR_LOCATIONS.find((l) => l.name === e.target.value);
                    if (found) {
                      setCurrentLocation(found);
                      setSelectedCity(found.name);
                    }
                  }}
                >
                  <option value="" disabled>Select Location</option>
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}, {loc.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary Search Button */}
              <button type="submit" className="search-submit-btn">
                Search
              </button>
            </form>

            {/* Popular Searches Tags below search bar */}
            <div className="hero-popular-row">
              <span className="popular-label">Popular :</span>
              <div className="popular-tag-pills">
                {popularSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="popular-tag-pill"
                    onClick={() => {
                      setSearchQuery(term);
                      setCurrentView('find-workers');
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Right: Professional Worker Graphic with Geometric Polygonal Backdrop */}
          <div className="hero-right-col">
            <div className="hero-visual-card-wrap">
              {/* Polygonal Background Shapes */}
              <div className="hero-backdrop-poly" />
              <div className="hero-backdrop-glow" />

              {/* Professional Smiling Worker Image Cutout */}
              <div className="hero-worker-image-container">
                <img
                  src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&auto=format&fit=crop&q=80"
                  alt="Professional skilled worker"
                  className="hero-worker-portrait"
                />
              </div>

              {/* Floating Verified Direct Call Trust Badge */}
              <div className="floating-trust-card float-left">
                <div className="trust-icon-circle green">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <div className="trust-card-title">Direct Calls Only</div>
                  <div className="trust-card-sub">Zero middleman delays</div>
                </div>
              </div>

              <div className="floating-trust-card float-right">
                <div className="trust-icon-circle blue">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="trust-card-title">Verified Profiles</div>
                  <div className="trust-card-sub">100% Genuine Numbers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. DOWN LOGIN (Directly below Hero Section - No other unnecessary info)
          ================================================== */}
      <GoogleHeroLoginBanner />
    </div>
  );
};
