import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, Send, User, MessageSquare, ChevronRight, Heart, Shield, Award, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet';

// ── Social Icons ──
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);
const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

// ── Contact Form ──
function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', service: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const services = ["Medical Tourism", "Doctor Consultation", "Hospital Assistance", "Visa & Travel Support", "Second Opinion", "Post-Treatment Care"];

  const inputStyle = (name) => ({
    width: '100%', padding: '13px 14px 13px 42px',
    border: focused === name ? '2px solid #0d9488' : '2px solid #e2e8f0',
    borderRadius: '12px', fontSize: '15px', outline: 'none',
    background: focused === name ? '#f0fdfa' : '#f8fafc',
    color: '#0f2e2b', transition: 'all 0.25s', boxSizing: 'border-box', fontFamily: 'inherit'
  });
  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: '700',
    color: '#0f766e', marginBottom: '8px', letterSpacing: '0.07em', textTransform: 'uppercase'
  };
  const iconStyle = (name) => ({
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
    color: focused === name ? '#0d9488' : '#94a3b8', transition: 'color 0.2s'
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        {[
          { name: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text', icon: <User size={15}/> },
          { name: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email', icon: <Mail size={15}/> }
        ].map(f => (
          <div key={f.name}>
            <label style={labelStyle}>{f.label}</label>
            <div style={{ position: 'relative' }}>
              <span style={iconStyle(f.name)}>{f.icon}</span>
              <input type={f.type} name={f.name} placeholder={f.placeholder} value={formData[f.name]}
                onChange={handleChange} onFocus={() => setFocused(f.name)} onBlur={() => setFocused('')}
                required style={inputStyle(f.name)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <span style={iconStyle('phone')}><Phone size={15}/></span>
            <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone}
              onChange={handleChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused('')}
              style={inputStyle('phone')} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Service Needed</label>
          <select name="service" value={formData.service} onChange={handleChange}
            onFocus={() => setFocused('service')} onBlur={() => setFocused('')}
            style={{ ...inputStyle('service'), padding: '13px 14px', color: formData.service ? '#0f2e2b' : '#94a3b8', cursor: 'pointer' }}>
            <option value="">Select a service...</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={labelStyle}>Subject</label>
        <div style={{ position: 'relative' }}>
          <span style={iconStyle('subject')}><MessageSquare size={15}/></span>
          <input type="text" name="subject" placeholder="How can we help you?" value={formData.subject}
            onChange={handleChange} onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
            style={inputStyle('subject')} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Your Message</label>
        <textarea name="message" rows={5}
          placeholder="Describe your medical needs, questions, or how we can assist you..."
          value={formData.message} onChange={handleChange}
          onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
          required
          style={{
            width: '100%', padding: '14px',
            border: focused === 'message' ? '2px solid #0d9488' : '2px solid #e2e8f0',
            borderRadius: '12px', fontSize: '15px', outline: 'none', resize: 'vertical',
            background: focused === 'message' ? '#f0fdfa' : '#f8fafc',
            color: '#0f2e2b', transition: 'all 0.25s', boxSizing: 'border-box',
            fontFamily: 'inherit', lineHeight: '1.6'
          }} />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{formData.message.length}/500</div>
      </div>

      <button type="submit" style={{
        width: '100%', padding: '16px 32px',
        background: submitted ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #0f766e, #0d9488)',
        color: 'white', border: 'none', borderRadius: '14px',
        fontSize: '16px', fontWeight: '700', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        transition: 'all 0.3s', letterSpacing: '0.02em',
        boxShadow: submitted ? '0 8px 25px rgba(16,185,129,0.35)' : '0 8px 28px rgba(13,148,136,0.4)',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(13,148,136,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(13,148,136,0.4)'; }}
      >
        {submitted ? <><CheckCircle size={20}/> Message Sent Successfully!</> : <><Send size={20}/> Send Message</>}
      </button>

      <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', margin: 0 }}>
        🔒 Your information is secure and will never be shared with third parties.
      </p>
    </form>
  );
}

// ── GST Certificate Badge + Modal ──
function GSTBadge() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const GSTIN = "07AAKCM4036B1ZS";

  const copyGST = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(GSTIN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── Badge Card ── */}
      <div onClick={() => setShowModal(true)} style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 55%, #14b8a6 100%)',
        borderRadius: '20px', padding: '24px 26px', cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(15,118,110,0.35)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(15,118,110,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(15,118,110,0.35)'; }}
      >
        {/* dot grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        {/* ghost GST */}
        <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', fontSize: '96px', fontWeight: '900', color: 'rgba(255,255,255,0.06)', lineHeight: 1, pointerEvents: 'none', letterSpacing: '-4px', userSelect: 'none' }}>GST</div>

        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '16px', position: 'relative' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0, background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.62)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Govt. of India — GST Registration</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginTop: '3px' }}>Medicway Care Pvt. Ltd.</div>
          </div>
        </div>

        {/* GSTIN */}
        <div style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '12px', padding: '12px 15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>GSTIN</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: 'white', letterSpacing: '0.12em', fontFamily: 'monospace' }}>{GSTIN}</div>
          </div>
          <button onClick={copyGST} style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)', color: 'white', padding: '7px 13px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative' }}>
          {[{ label: 'Active', dot: true }, { label: 'Regular Taxpayer' }, { label: 'New Delhi' }].map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', padding: '4px 11px', color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {p.dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'blink 2s infinite' }} />}
              {p.label}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.68)', fontSize: '12px', fontWeight: '600', position: 'relative' }}>
          <FileText size={12} /> View Full Certificate →
        </div>
      </div>

      {/* ── Full Certificate Modal ── */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(4,47,46,0.80)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#f0fdfa', borderRadius: '24px', maxWidth: '740px', width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(15,118,110,0.45)', animation: 'slideUp 0.3s ease' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)', padding: '24px 28px', borderRadius: '24px 24px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} color="white" /></div>
                <div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.62)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Form GST REG-06 [See Rule 10(1)]</div>
                  <div style={{ fontSize: '15px', color: 'white', fontWeight: '700' }}>GST Registration Certificate</div>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', lineHeight: 1 }}>×</button>
            </div>

            {/* Govt Banner */}
            <div style={{ background: 'white', borderBottom: '3px solid #14b8a6', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #d97706, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>🇮🇳</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#042f2e' }}>Government of India</div>
                <div style={{ fontSize: '12px', color: '#5eada6', marginTop: '2px' }}>Goods and Services Tax Network — Registration Certificate</div>
              </div>
              <div style={{ marginLeft: 'auto', background: '#ccfbf1', border: '1px solid #5eada6', borderRadius: '10px', padding: '9px 14px', textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '10px', color: '#0f766e', fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Registration No.</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f766e', letterSpacing: '0.1em', marginTop: '2px', fontFamily: 'monospace' }}>{GSTIN}</div>
              </div>
            </div>

            {/* Table */}
            <div style={{ padding: '18px 28px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    [1, 'Legal Name', <strong style={{ color: '#0f766e', fontSize: '14px' }}>MEDICWAY CARE PRIVATE LIMITED</strong>],
                    [2, 'Trade Name, if any', 'MEDICWAY CARE PRIVATE LIMITED'],
                    [3, 'Additional Trade Names', <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>],
                    [4, 'Constitution of Business', <span style={{ background: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', padding: '3px 11px', borderRadius: '50px', fontSize: '12px', fontWeight: '600' }}>Private Limited Company</span>],
                    [5, 'Address of Principal Place',
                      <span style={{ lineHeight: '1.7' }}>
                        <strong style={{ display: 'block', color: '#042f2e' }}>MR-1, 5th Floor, Wing-A</strong>
                        Statesman House, 148, Barakhamba Road<br/>New Delhi, Delhi — 110001
                      </span>
                    ],
                    [6, 'Date of Liability', <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>],
                    [7, 'Period of Validity',
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div><div style={{ fontSize: '10px', color: '#5eada6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</div><div style={{ fontWeight: '700', color: '#042f2e', fontSize: '14px' }}>07 / 01 / 2026</div></div>
                        <span style={{ color: '#94a3b8' }}>→</span>
                        <div><div style={{ fontSize: '10px', color: '#5eada6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>To</div><div style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>Not Applicable</div></div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '4px 11px', borderRadius: '50px', fontSize: '11px', fontWeight: '700' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', animation: 'blink 2s infinite' }}/>Active
                        </span>
                      </div>
                    ],
                    [8, 'Type of Registration', <span style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '3px 11px', borderRadius: '50px', fontSize: '12px', fontWeight: '700' }}>Regular</span>],
                    [9, 'Particulars of Approving', 'Centre'],
                  ].map(([num, label, val]) => (
                    <tr key={num} style={{ borderBottom: '1px solid #d1fae5' }}>
                      <td style={{ padding: '12px 8px', fontSize: '12px', color: '#5eada6', fontWeight: '600', width: '32px', verticalAlign: 'top' }}>{num}</td>
                      <td style={{ padding: '12px 13px', fontSize: '12px', fontWeight: '600', color: '#134e4a', background: 'rgba(204,251,241,0.35)', width: '185px', verticalAlign: 'top' }}>{label}</td>
                      <td style={{ padding: '12px 13px', fontSize: '13px', color: '#0f2e2b', verticalAlign: 'top', lineHeight: '1.6' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatory */}
            <div style={{ margin: '0 28px 18px', background: 'white', borderRadius: '14px', border: '1px solid #d1fae5', padding: '18px 22px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#5eada6', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Authorised Signatory</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '13px' }}>
                {[['Name', 'Sudhanshu Singh'], ['Designation', 'Superintendent'], ['Jurisdictional Office', 'Connaught Place'], ['Date of Issue', '07 / 01 / 2026'], ['Signature Status', '✓ Digitally Signed'], ['Authority', 'GSTN Network']].map(([l, v], i) => (
                  <div key={i}>
                    <div style={{ fontSize: '10px', color: '#5eada6', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{l}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: i === 4 ? '#0d9488' : '#042f2e' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Original doc ref */}
            <div style={{ margin: '0 28px 18px', background: 'white', borderRadius: '13px', border: '1px solid #d1fae5', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '56px', height: '72px', borderRadius: '8px', background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', border: '2px solid #5eada6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>📄</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#042f2e' }}>Original GST Certificate</div>
                <div style={{ fontSize: '11px', color: '#5eada6', marginTop: '3px' }}>Government issued · Digitally signed · Form GST REG-06</div>
                <div style={{ marginTop: '7px', display: 'flex', gap: '7px' }}>
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 9px', borderRadius: '50px', fontSize: '10px', fontWeight: '700' }}>✓ Verified</span>
                  <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 9px', borderRadius: '50px', fontSize: '10px', fontWeight: '600' }}>Official Document</span>
                </div>
              </div>
              <button onClick={() => window.open('/assets/gst-certificate.png', '_blank')} style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '9px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>View Original</button>
            </div>

            {/* Note */}
            <div style={{ margin: '0 28px 26px', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '11px', padding: '12px 16px', fontSize: '12px', color: '#92400e', lineHeight: '1.7' }}>
              <strong>📌 Note:</strong> The registration certificate is required to be prominently displayed at all places of business in the State. This is a system generated digitally signed Registration Certificate issued based on the approval of application granted on 07/01/2026 by the jurisdictional authority.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Contact Page ──
export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact MedicwayCare - Get Healthcare Support</title>
        <meta name="description" content="Contact MedicwayCare for medical tourism inquiries, doctor consultations, and healthcare services. 24/7 support available via phone, email, WhatsApp." />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{`
        @keyframes floatUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-ring {
          0%{box-shadow:0 0 0 0 rgba(13,148,136,0.35)}
          70%{box-shadow:0 0 0 10px rgba(13,148,136,0)}
          100%{box-shadow:0 0 0 0 rgba(13,148,136,0)}
        }
        .c-card {
          background: white; border-radius: 18px; padding: 20px 22px;
          box-shadow: 0 4px 20px rgba(15,118,110,0.07);
          border: 1px solid rgba(13,148,136,0.12);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .c-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(13,148,136,0.16); }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(20,184,166,0.15); border: 1px solid rgba(20,184,166,0.3);
          color: #5eefea; padding: 7px 17px; border-radius: 50px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 18px;
        }
        .social-btn {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
        }
        .social-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
        .icon-wrap {
          width: 48px; height: 48px; border-radius: 13px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          animation: pulse-ring 3s infinite;
        }
        .section-bar { width: 42px; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #0f766e, #14b8a6); margin: 11px 0 14px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f0fdfa', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #042f2e 0%, #0f766e 50%, #0d9488 100%)', padding: '88px 24px 60px', position: 'relative', overflow: 'hidden' }}>
          {[{ s:420,t:'-160px',r:'-110px',o:0.06 }, { s:260,b:'-90px',l:'-70px',o:0.08 }, { s:160,t:'30px',l:'12%',o:0.05 }].map((c,i) => (
            <div key={i} style={{ position:'absolute', width:c.s, height:c.s, borderRadius:'50%', border:'2px solid white', opacity:c.o, top:c.t, bottom:c.b, left:c.l, right:c.r, pointerEvents:'none' }}/>
          ))}
          <div style={{ position:'absolute', top:'50%', right:'7%', transform:'translateY(-50%)', opacity:0.06, pointerEvents:'none' }}>
            <svg width="210" height="210" viewBox="0 0 100 100" fill="white"><rect x="35" y="5" width="30" height="90" rx="8"/><rect x="5" y="35" width="90" height="30" rx="8"/></svg>
          </div>
          <div style={{ maxWidth:'860px', margin:'0 auto', textAlign:'center', position:'relative', animation:'floatUp 0.8s ease both' }}>
            <div className="hero-badge"><Heart size={13} fill="currentColor"/> We Care For You</div>
            <h1 style={{ fontFamily:"'Lora', serif", fontSize:'clamp(2.2rem, 5vw, 3.5rem)', fontWeight:'600', color:'white', margin:'0 0 16px', lineHeight:1.2, letterSpacing:'-0.02em' }}>
              Get In Touch With<br/>
              <span style={{ background:'linear-gradient(90deg, #5eefea, #99f6e4, #5eefea)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Our Care Team</span>
            </h1>
            <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,0.72)', maxWidth:'540px', margin:'0 auto 36px', lineHeight:1.75 }}>
              Have questions about our services? Need help finding the right healthcare provider? We're here every step of the way.
            </p>
            <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
              {['24/7 Support','500+ Hospitals','50,000+ Patients','15+ Countries'].map((s,i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.11)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'50px', padding:'9px 18px', color:'white', fontSize:'13px', fontWeight:'600' }}>{s}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Wave divider */}
        <div style={{ marginTop:'-2px', lineHeight:0 }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', width:'100%' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" fill="url(#tealGrad)"/>
            <defs><linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#042f2e"/><stop offset="50%" stopColor="#0f766e"/><stop offset="100%" stopColor="#0d9488"/></linearGradient></defs>
          </svg>
        </div>

        {/* Main Grid */}
        <section style={{ padding:'52px 24px 80px' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'370px 1fr', gap:'34px', alignItems:'start' }}>

              {/* LEFT COLUMN */}
              <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

                <div>
                  <h2 style={{ fontFamily:"'Lora', serif", fontSize:'1.65rem', fontWeight:'600', color:'#042f2e', margin:0 }}>Contact Information</h2>
                  <div className="section-bar"/>
                  <p style={{ color:'#5eada6', fontSize:'14px', margin:0, lineHeight:1.65 }}>Reach out through any of our channels. Our team responds promptly.</p>
                </div>

                {/* Info cards */}
                {[
                  { icon:<Phone size={19}/>, title:'Phone', lines:['+91 93547 99090','+91 93547 99090'], bg:'linear-gradient(135deg, #dbeafe, #bfdbfe)', color:'#2563eb' },
                  { icon:<Mail size={19}/>, title:'Email', lines:['info@medicwaycare.in','support@medicwaycare.in'], bg:'linear-gradient(135deg, #ccfbf1, #99f6e4)', color:'#0f766e' },
                  { icon:<MapPin size={19}/>, title:'Address', lines:['MR-1, 5th Floor, Wing-A, Statesman House','148 Barakhamba Road, New Delhi 110001'], bg:'linear-gradient(135deg, #dcfce7, #bbf7d0)', color:'#16a34a' },
                  { icon:<Clock size={19}/>, title:'Business Hours', lines:['Mon–Fri: 9:00 AM – 6:00 PM','Sat: 9:00 AM – 2:00 PM','Sun: Emergency Only'], bg:'linear-gradient(135deg, #fef3c7, #fde68a)', color:'#d97706' },
                ].map((item,i) => (
                  <div key={i} className="c-card" style={{ display:'flex', alignItems:'flex-start', gap:'15px' }}>
                    <div className="icon-wrap" style={{ background:item.bg, color:item.color }}>{item.icon}</div>
                    <div>
                      <h3 style={{ margin:'0 0 5px', fontSize:'14px', fontWeight:'700', color:'#042f2e' }}>{item.title}</h3>
                      {item.lines.map((l,j) => <p key={j} style={{ margin:'2px 0', fontSize:'13px', color:'#5eada6' }}>{l}</p>)}
                    </div>
                  </div>
                ))}

                {/* Why Choose Us */}
                {/* <div className="c-card" style={{ background:'linear-gradient(135deg, #042f2e, #0f766e)', border:'none' }}>
                  <h3 style={{ fontFamily:"'Lora', serif", fontSize:'1rem', fontWeight:'600', color:'white', margin:'0 0 13px' }}>Why Choose Us?</h3>
                  {['24/7 Customer Support','Verified Healthcare Providers','Transparent Pricing','End-to-End Assistance','Multilingual Support'].map((item,i,arr) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.08)':'none' }}>
                      <div style={{ width:'21px', height:'21px', borderRadius:'50%', background:'rgba(20,184,166,0.25)', border:'1px solid rgba(20,184,166,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <CheckCircle size={12} color="#5eefea"/>
                      </div>
                      <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.85)', fontWeight:'500', flex:1 }}>{item}</span>
                      <ChevronRight size={12} color="rgba(255,255,255,0.3)"/>
                    </div>
                  ))}
                </div> */}

                {/* GST Proof Badge */}
                <GSTBadge/>

                {/* Social */}
                <div className="c-card">
                  <h3 style={{ fontFamily:"'Lora', serif", fontSize:'1rem', fontWeight:'600', color:'#042f2e', margin:'0 0 14px' }}>Connect With Us</h3>
                  <div style={{ display:'flex', gap:'10px', marginBottom:'13px' }}>
                    <a href="https://www.facebook.com/share/1LEebindtd/" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ background:'#dbeafe', color:'#2563eb' }}><FacebookIcon/></a>
                    <a href="https://www.instagram.com/medicwaycare?igsh=MXU4MWZyZTFrdHV3Yw==" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ background:'#fce7f3', color:'#db2777' }}><InstagramIcon/></a>
                    <a href="https://www.youtube.com/@MedicwayCare" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ background:'#fee2e2', color:'#dc2626' }}><YoutubeIcon/></a>
                  </div>
                  <a href="https://wa.me/919354799090" target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background:'linear-gradient(135deg, #22c55e, #16a34a)', color:'white', borderRadius:'12px', padding:'12px 18px', textDecoration:'none', fontWeight:'700', fontSize:'14px', boxShadow:'0 6px 20px rgba(34,197,94,0.35)', transition:'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(34,197,94,0.45)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(34,197,94,0.35)'; }}>
                    <WhatsappIcon/> Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div style={{ background:'white', borderRadius:'24px', boxShadow:'0 8px 40px rgba(15,118,110,0.12)', border:'1px solid rgba(13,148,136,0.1)', overflow:'hidden' }}>
                {/* Form header */}
                <div style={{ background:'linear-gradient(135deg, #0f766e, #0d9488)', padding:'32px 36px 28px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.1)', pointerEvents:'none' }}/>
                  <div style={{ position:'absolute', bottom:'-20px', left:'40px', width:'80px', height:'80px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.07)', pointerEvents:'none' }}/>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px', position:'relative' }}>
                    <div style={{ width:'48px', height:'48px', borderRadius:'13px', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Send size={20} color="white"/>
                    </div>
                    <div>
                      <h2 style={{ fontFamily:"'Lora', serif", fontSize:'1.45rem', fontWeight:'600', color:'white', margin:'0 0 3px' }}>Send Us a Message</h2>
                      <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'13px', margin:0 }}>We typically respond within 2–4 hours</p>
                    </div>
                  </div>
                  <div style={{ marginTop:'18px', display:'flex', gap:'14px', position:'relative' }}>
                    {[{label:'Avg. Response',value:'< 2 hrs'},{label:'Satisfaction',value:'98.5%'},{label:'Cases Handled',value:'50K+'}].map((s,i) => (
                      <div key={i} style={{ background:'rgba(255,255,255,0.12)', borderRadius:'10px', padding:'9px 13px', flex:1, textAlign:'center' }}>
                        <div style={{ color:'white', fontWeight:'800', fontSize:'15px' }}>{s.value}</div>
                        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'11px', fontWeight:'500', marginTop:'2px' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust strip */}
                <div style={{ background:'#f0fdfa', borderBottom:'1px solid #ccfbf1', padding:'13px 36px', display:'flex', alignItems:'center', gap:'22px', flexWrap:'wrap' }}>
                  {[
                    { icon:<Shield size={14} color="#0f766e"/>, text:'GST Registered', sub:'07AAKCM4036B1ZS' },
                    { icon:<Award size={14} color="#0f766e"/>, text:'Govt. Verified', sub:'Pvt. Ltd. Company' },
                    { icon:<CheckCircle size={14} color="#0f766e"/>, text:'Secure & Trusted', sub:'Healthcare Standards' },
                  ].map((item,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      {item.icon}
                      <div>
                        <div style={{ fontSize:'12px', fontWeight:'700', color:'#0f766e' }}>{item.text}</div>
                        <div style={{ fontSize:'10px', color:'#5eada6', fontWeight:'500' }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding:'34px 36px' }}>
                  <ContactForm/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        {/* <section style={{ background:'linear-gradient(135deg, #042f2e, #0f766e)', padding:'58px 24px', textAlign:'center' }}>
          <div style={{ maxWidth:'660px', margin:'0 auto' }}>
            <Heart size={30} color="#5eefea" fill="#5eefea" style={{ marginBottom:'13px' }}/>
            <h2 style={{ fontFamily:"'Lora', serif", fontSize:'1.85rem', color:'white', margin:'0 0 10px', fontWeight:'600' }}>Your Health Is Our Priority</h2>
            <p style={{ color:'rgba(255,255,255,0.62)', fontSize:'15px', margin:'0 0 28px', lineHeight:1.75 }}>
              Whether it's a routine consultation or a complex medical procedure, MedicwayCare is with you every step of the journey.
            </p>
            <div style={{ display:'flex', gap:'13px', justifyContent:'center', flexWrap:'wrap' }}>
              <a href="https://wa.me/919354799090" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', gap:'8px', background:'#22c55e', color:'white', padding:'13px 24px', borderRadius:'50px', textDecoration:'none', fontWeight:'700', fontSize:'14px', boxShadow:'0 6px 20px rgba(34,197,94,0.4)', transition:'transform 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
                <WhatsappIcon/> Chat on WhatsApp
              </a>
              <a href="tel:+919354799090"
                style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.11)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.22)', color:'white', padding:'13px 24px', borderRadius:'50px', textDecoration:'none', fontWeight:'700', fontSize:'14px', transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.11)'}>
                <Phone size={16}/> Call Us Now
              </a>
            </div>
          </div>
        </section> */}

      </div>
    </>
  );
}