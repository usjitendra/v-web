import React, { useState } from "react";
import bannerimg from '../assets/background.png';


const COUNTRIES = [
    "India", "Bangladesh", "Nepal", "Sri Lanka", "Pakistan",
    "Afghanistan", "Iraq", "Kenya", "Nigeria", "Ethiopia",
    "Tanzania", "Uganda", "Ghana", "Egypt", "UAE",
    "Saudi Arabia", "Oman", "Kuwait", "USA", "UK",
    "Canada", "Australia", "Germany", "France", "Other"
];

const CITIES = {
    India: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"],
    Bangladesh: ["Dhaka", "Chittagong", "Sylhet"],
    Nepal: ["Kathmandu", "Pokhara", "Biratnagar"],
    Other: ["Other City"]
};

const COUNTRY_CODES = {
    India: "+91", Bangladesh: "+880", Nepal: "+977", "Sri Lanka": "+94",
    Pakistan: "+92", UAE: "+971", "Saudi Arabia": "+966", USA: "+1",
    UK: "+44", Other: "+00"
};

// Avatar stack — small circular doctor images (using colored initials as fallback)
const AVATARS = [
    { bg: "#0f766e", initials: "DR" },
    { bg: "#0d9488", initials: "MS" },
    { bg: "#14b8a6", initials: "KP" },
    { bg: "#0f766e", initials: "AK" },
    { bg: "#5eada6", initials: "RV" },
];

export default function HeroBanner() {
    const [form, setForm] = useState({
        name: "", country: "India", city: "", phone: "", problem: "", age: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3500);
    };

    const cityList = CITIES[form.country] || CITIES["Other"];
    const phoneCode = COUNTRY_CODES[form.country] || "+91";

    const inputBase = (name) => ({
        width: "100%",
        padding: "12px 14px",
        border: focused === name ? "2px solid #0d9488" : "1.5px solid #d1fae5",
        borderRadius: "10px",
        fontSize: "14px",
        outline: "none",
        background: focused === name ? "#f0fdfa" : "white",
        color: "#042f2e",
        transition: "all 0.22s",
        boxSizing: "border-box",
        fontFamily: "inherit",
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes starPop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .hero-banner * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-banner { font-family: 'DM Sans', sans-serif; }

        .form-input:focus { border-color: #0d9488 !important; background: #f0fdfa !important; }
        .form-input::placeholder { color: #94a3b8; }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235eada6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px !important; }

        .get-quote-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #0f766e, #0d9488);
          color: white; border: none; border-radius: 10px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          transition: all 0.3s; letter-spacing: 0.02em;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 6px 20px rgba(13,148,136,0.4);
        }
        .get-quote-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(13,148,136,0.55);
        }
        .get-quote-btn:active { transform: translateY(0); }

        .star { display: inline-block; animation: starPop 0.4s ease both; }
        .star:nth-child(1){animation-delay:0.1s}
        .star:nth-child(2){animation-delay:0.18s}
        .star:nth-child(3){animation-delay:0.26s}
        .star:nth-child(4){animation-delay:0.34s}
        .star:nth-child(5){animation-delay:0.42s}

        .trust-pill {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.14); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.22); border-radius: 50px;
          padding: 6px 14px; color: white; font-size: 12px; font-weight: 600;
        }

        .phone-row { display: flex; gap: 8px; }
        .phone-code {
          flex-shrink: 0; width: 72px; padding: 12px 10px;
          border: 1.5px solid #d1fae5; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #0f766e;
          background: #f0fdfa; display: flex; align-items: center; justify-content: center;
        }

        /* ── RESPONSIVE STYLES ── */

        /* Content grid: side-by-side on desktop, stacked on mobile */
        .hero-content-grid {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 48px;
          align-items: center;
        }

        /* Tablet: narrower form column */
        @media (max-width: 1024px) {
          .hero-content-grid {
            grid-template-columns: 1fr 360px;
            gap: 32px;
            padding: 48px 20px;
          }
        }

        /* Mobile: single column, form below text */
        @media (max-width: 768px) {
          .hero-content-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 36px 16px 40px;
          }
          .hero-left-col {
            animation: fadeSlideRight 0.75s ease both;
          }
          .hero-form-card {
            animation: fadeSlideIn 0.75s ease 0.15s both;
          }
        }

        /* Small mobile tweaks */
        @media (max-width: 480px) {
          .hero-content-grid {
            padding: 28px 12px 36px;
            gap: 24px;
          }
          .trust-pills-row {
            gap: 7px !important;
          }
          .trust-pill {
            font-size: 11px;
            padding: 5px 10px;
          }
          .hero-form-card {
            padding: 24px 16px !important;
          }
          .phone-code {
            width: 60px;
            font-size: 12px;
          }
        }

        /* Make country+city row stack on very small screens */
        @media (max-width: 360px) {
          .country-city-row {
            flex-direction: column !important;
          }
        }
      `}</style>

            <div className="hero-banner" style={{
                position: "relative",
                width: "100%",
                minHeight: "580px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
            }}>
                {/* ── Background image ── */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${bannerimg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                }} />

                {/* ── Teal overlay gradient — left to right ── */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(105deg, rgba(4,47,46,0.88) 0%, rgba(15,118,110,0.72) 35%, rgba(13,148,136,0.35) 62%, rgba(0,0,0,0.1) 100%)",
                }} />

                {/* ── Decorative circles ── */}
                {[
                    { w: 320, h: 320, top: "-100px", left: "-80px", o: 0.06 },
                    { w: 180, h: 180, bottom: "-50px", left: "20%", o: 0.05 },
                    { w: 100, h: 100, top: "40px", left: "42%", o: 0.04 },
                ].map((c, i) => (
                    <div key={i} style={{
                        position: "absolute", width: c.w, height: c.h, borderRadius: "50%",
                        border: "2px solid white", opacity: c.o,
                        top: c.top, bottom: c.bottom, left: c.left, pointerEvents: "none",
                    }} />
                ))}

                {/* ── Medical cross watermark ── */}
                <div style={{ position: "absolute", bottom: "30px", left: "6%", opacity: 0.05, pointerEvents: "none" }}>
                    <svg width="160" height="160" viewBox="0 0 100 100" fill="white">
                        <rect x="35" y="5" width="30" height="90" rx="8" />
                        <rect x="5" y="35" width="90" height="30" rx="8" />
                    </svg>
                </div>

                {/* ── Content grid ── */}
                <div className="hero-content-grid">

                    {/* LEFT: Text */}
                    <div className="hero-left-col" style={{ animation: "fadeSlideRight 0.75s ease both" }}>
                        {/* Badge */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "7px",
                            background: "rgba(20,184,166,0.18)", border: "1px solid rgba(94,239,234,0.35)",
                            borderRadius: "50px", padding: "6px 16px", marginBottom: "22px",
                            color: "#5eefea", fontSize: "11px", fontWeight: "700", letterSpacing: "0.09em", textTransform: "uppercase"
                        }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#5eefea", animation: "blink 2s infinite" }} />
                            Trusted Medical Tourism Company in India
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontFamily: "'Lora', serif",
    
                            fontWeight: "700",
                            color: "white",
                            lineHeight: 1,
                            marginBottom: "5px",
                            letterSpacing: "-0.02em",
                        }} className="text-[2rem] ">
                            Affordable Medical Treatment<br />
                            <span style={{
                                background: "linear-gradient(90deg, #5eefea, #99f6e4)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}>in India for International Patients</span><br />
                            With Personal Care
                        </h1>
                        {/* Subtitle */}
                        <p style={{
                            fontSize: "15px", color: "rgba(255,255,255,0.72)",
                            lineHeight: 1.75, marginBottom: "36px", maxWidth: "420px"
                        }}>
                            MedicwayCare connects you with top hospitals and expert doctors in India. Get affordable treatment, free consultation, and complete medical travel support from inquiry to recovery.
                        </p>

                        {/* Avatar stack + patient count */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
                            <div style={{ display: "flex" }}>
                                {AVATARS.map((a, i) => (
                                    <div key={i} style={{
                                        width: "42px", height: "42px", borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${a.bg}, #14b8a6)`,
                                        border: "2.5px solid rgba(255,255,255,0.85)",
                                        marginLeft: i === 0 ? 0 : "-10px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "11px", fontWeight: "700", color: "white",
                                        zIndex: AVATARS.length - i,
                                        position: "relative",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                    }}>{a.initials}</div>
                                ))}
                            </div>
                            <div>
                                <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>1,00,000+ Patients</div>
                                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Assisted Since 2016</div>
                            </div>
                        </div>

                        {/* Google rating */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "10px",
                            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
                            padding: "10px 16px",
                        }}>
                            {/* Google G */}
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z" />
                                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z" />
                                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z" />
                            </svg>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <span style={{ color: "white", fontWeight: "800", fontSize: "15px" }}>4.7</span>
                                    <div>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className="star" style={{ color: "#f59e0b", fontSize: "13px" }}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.58)", fontSize: "11px" }}>Google Rating</div>
                            </div>
                        </div>

                        {/* Trust pills row */}
                        <div className="trust-pills-row" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
                            {["🏥 500+ Hospitals", "🌍 15+ Countries", "⚡ 24/7 Support"].map((p, i) => (
                                <div key={i} className="trust-pill">{p}</div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Form card */}
                    <div className="hero-form-card" style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "32px 28px",
                        boxShadow: "0 24px 70px rgba(4,47,46,0.28), 0 0 0 1px rgba(13,148,136,0.08)",
                        animation: "fadeSlideIn 0.75s ease 0.15s both",
                        position: "relative",
                    }}>
                        {/* Top teal accent strip */}
                        <div style={{
                            position: "absolute", top: 0, left: "28px", right: "28px", height: "3px",
                            background: "linear-gradient(90deg, #0f766e, #14b8a6, #0f766e)",
                            borderRadius: "0 0 4px 4px",
                        }} />

                        <h2 style={{
                            fontFamily: "'Lora', serif",
                            fontSize: "1.4rem", fontWeight: "600", color: "#042f2e",
                            textAlign: "center", marginBottom: "6px", marginTop: "6px",
                        }}>
                            Get Free Medical Consultation
                        </h2>
                        <p style={{ textAlign: "center", fontSize: "13px", color: "#5eada6", marginBottom: "22px" }}>
                          Affordable treatment • Top hospitals • No obligation
                        </p>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "0 4px" }}>

                            {/* Patient Name */}
                            <input
                                className="form-input"
                                name="name"
                                type="text"
                                placeholder="Patient Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                onFocus={() => setFocused("name")}
                                onBlur={() => setFocused("")}
                                style={{ ...inputBase("name"), padding: "10px 12px", fontSize: "13px" }}
                            />

                            {/* Country + City (same row) */}
                            <div className="country-city-row" style={{ display: "flex", gap: "8px" }}>
                                <select
                                    className="form-input form-select"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("country")}
                                    onBlur={() => setFocused("")}
                                    style={{ ...inputBase("country"), padding: "10px", fontSize: "13px", flex: 1 }}
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <select
                                    className="form-input form-select"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    onFocus={() => setFocused("city")}
                                    onBlur={() => setFocused("")}
                                    style={{ ...inputBase("city"), padding: "10px", fontSize: "13px", flex: 1 }}
                                >
                                    <option value="">City</option>
                                    {cityList.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Phone */}
                            <div className="phone-row">
                                <div className="phone-code" style={{ padding: "10px" }}>{phoneCode}</div>
                                <input
                                    className="form-input"
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    onFocus={() => setFocused("phone")}
                                    onBlur={() => setFocused("")}
                                    style={{ ...inputBase("phone"), padding: "10px 12px", fontSize: "13px" }}
                                />
                            </div>

                            {/* Problem */}
                            <textarea
                                className="form-input"
                                name="problem"
                                placeholder="Medical Problem"
                                value={form.problem}
                                onChange={handleChange}
                                onFocus={() => setFocused("problem")}
                                onBlur={() => setFocused("")}
                                rows={2}
                                style={{
                                    ...inputBase("problem"),
                                    padding: "10px 12px",
                                    fontSize: "13px",
                                    resize: "none"
                                }}
                            />

                            {/* Age */}
                            <input
                                className="form-input"
                                name="age"
                                type="text"
                                placeholder="Age / DOB"
                                value={form.age}
                                onChange={handleChange}
                                onFocus={() => setFocused("age")}
                                onBlur={() => setFocused("")}
                                style={{ ...inputBase("age"), padding: "10px 12px", fontSize: "13px" }}
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                className="get-quote-btn"
                                style={{
                                    padding: "12px",
                                    fontSize: "14px",
                                    background: submitted
                                        ? "linear-gradient(135deg, #10b981, #059669)"
                                        : "linear-gradient(135deg, #ef4444, #dc2626)"
                                }}
                            >
                                {submitted ? "✓ Request Sent!" : "Get FREE Quote"}
                            </button>
                        </form>

                        {/* Legal note */}
                        <p style={{
                            textAlign: "center", fontSize: "11px", color: "#94a3b8",
                            marginTop: "12px", lineHeight: 1.6,
                        }}>
                            By submitting the form I agree to the{" "}
                            <a href="#" style={{ color: "#0d9488", textDecoration: "none", fontWeight: "600" }}>Terms of Use</a>
                            {" "}and{" "}
                            <a href="#" style={{ color: "#0d9488", textDecoration: "none", fontWeight: "600" }}>Privacy Policy</a>
                            {" "}of MedicwayCare.
                        </p>

                        {/* Bottom trust badges */}
                        <div style={{
                            marginTop: "14px", display: "flex", justifyContent: "center", gap: "16px",
                            borderTop: "1px solid #d1fae5", paddingTop: "14px",
                        }}>
                            {[
                                { icon: "🔒", label: "100% Secure" },
                                { icon: "⚕️", label: "Expert Doctors" },
                                { icon: "✅", label: "Free Consult" },
                            ].map((b, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "16px" }}>{b.icon}</div>
                                    <div style={{ fontSize: "10px", color: "#5eada6", fontWeight: "600", marginTop: "2px" }}>{b.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}