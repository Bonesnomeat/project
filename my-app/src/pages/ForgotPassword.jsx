import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";
import logoSrc from 'C:/Users/USER/sponza/project/my-app/public/img/a-sleek-modern-logo-design-featuring-the_goDenOD7TPS-KtuXM3BUnA_RzVYVD7bSjiL0zKDsLJ0uw-Photoroom.png';

const EMAILJS_SERVICE_ID  = 'service_eahqtsl';
const EMAILJS_TEMPLATE_ID = 'template_4ttm0yk';
const EMAILJS_PUBLIC_KEY  = 'hTaepWXyunfSFRAr4';

const THEME = {
    start: "#004e92",
    stop: "#000d7a",
    bgColor: "#00052d",
    color: "rgba(255,255,255,0.8)",
    inputBg: "rgba(0,0,0,0.4)",
    inputFocusBg: "rgba(0,0,0,0.5)",
    placeholderColor: "rgba(255,255,255,0.7)",
};

function StyledInput({ placeholder, icon, value, onChange, type = "text" }) {
    const [focused, setFocused] = useState(false);
    const uid = `fp-input-${placeholder?.replace(/\s+/g, '-')}`;
    return (
        <div style={{ position: "relative", width: "100%" }}>
            <style>{`.${uid}::placeholder { color: ${THEME.placeholderColor}; opacity: 1; }`}</style>
            {icon && (
                <span style={{
                    position: "absolute", left: 12, top: "50%",
                    transform: "translateY(-50%)", pointerEvents: "none",
                    display: "flex", alignItems: "center", zIndex: 1,
                }}>
                    {icon}
                </span>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={uid}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: "100%",
                    backgroundColor: focused ? THEME.inputFocusBg : THEME.inputBg,
                    border: `1px solid ${focused ? 'rgba(36,183,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 6,
                    color: THEME.color,
                    fontSize: 14,
                    padding: icon ? "11px 40px 11px 38px" : "11px 14px",
                    fontFamily: "Poppins, sans-serif",
                    outline: "none",
                    transition: "all 250ms ease-in-out",
                    boxSizing: "border-box",
                }}
            />
        </div>
    );
}

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // ✅ FIX 1: Initialize EmailJS once when component mounts
    useEffect(() => {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

            const resetData = {
                email,
                token: resetToken,
                expiry: Date.now() + 15 * 60 * 1000,
            };
            localStorage.setItem('sponza_reset', JSON.stringify(resetData));

            const resetLink = `${window.location.origin}/ResetPassword?token=${resetToken}&email=${encodeURIComponent(email)}`;

            // ✅ FIX 2: Use emailjs.send with explicit public key (most reliable method)
            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_name: email.split('@')[0],
                    to_email: email,
                    reset_link: resetLink,
                    // ✅ FIX 3: Added reply_to in case template uses it
                    reply_to: email,
                },
                EMAILJS_PUBLIC_KEY
            );

            console.log('EmailJS success:', result.status, result.text);
            setEmailSent(true);

        } catch (err) {
            console.error('EmailJS error full details:', err);

            // ✅ FIX 4: Show specific error messages based on error type
            if (err?.status === 400) {
                setError('Email template error. Check your EmailJS template variables.');
            } else if (err?.status === 401 || err?.status === 403) {
                setError('EmailJS authentication failed. Check your Public Key.');
            } else if (err?.status === 404) {
                setError('EmailJS service or template not found. Check your IDs.');
            } else {
                setError('Failed to send email. Please check your internet connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes float1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
                @keyframes float2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(14px) scale(0.97)} }
                .orb1{animation:float1 6s ease-in-out infinite}
                .orb2{animation:float2 8s ease-in-out infinite}
                .fp-btn:hover{opacity:0.85;transform:translateY(-1px)}
                .fp-btn{transition:opacity 200ms,transform 200ms}
            `}</style>

            <div style={{
                backgroundColor: THEME.bgColor, minHeight: "100vh", width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Poppins, sans-serif", padding: "24px",
            }}>
                <div style={{
                    display: "flex", width: "min(980px, 100%)", minHeight: 500,
                    borderRadius: 16, overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
                }}>

                    {/* ── LEFT PANEL ── */}
                    <div style={{
                        flex: "0 0 38%",
                        background: `linear-gradient(225deg, ${THEME.start} 16%, ${THEME.stop} 100%)`,
                        display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "center", padding: "48px 36px",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div className="orb1" style={{ position:"absolute", top:"10%", left:"10%", width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.08)", filter:"blur(2px)" }} />
                        <div className="orb2" style={{ position:"absolute", bottom:"12%", right:"8%", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.06)", filter:"blur(4px)" }} />

                        <div style={{ position:"relative", zIndex:1, textAlign:"center" }}>
                            <Link to={createPageUrl('Home')}>
                                <img src={logoSrc} alt="Sponza logo" style={{ width:200, height:"auto", objectFit:"contain", display:"block", margin:"0 auto 16px" }} />
                            </Link>
                            <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, lineHeight:1.6, maxWidth:220, margin:"0 auto" }}>
                                We'll send a password reset link to your registered email.
                            </p>
                            <div style={{ width:45, height:2, background:"rgba(255,255,255,0.3)", borderRadius:2, margin:"20px auto 0" }} />

                            <Link to={createPageUrl('SignIn')} style={{
                                display:"inline-flex", alignItems:"center", gap:6,
                                marginTop:48, color:"rgba(255,255,255,0.5)", fontSize:14,
                                textDecoration:"none",
                            }}>
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div style={{
                        flex:1, backgroundColor: THEME.bgColor,
                        display:"flex", flexDirection:"column", justifyContent:"center",
                        padding:"48px 44px",
                    }}>

                        {!emailSent ? (
                            <>
                                <h1 style={{ color:THEME.color, fontSize:26, fontWeight:700, letterSpacing:"-0.5px", marginBottom:4, textAlign:"center" }}>
                                    Forgot Password?
                                </h1>
                                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:32, textAlign:"center" }}>
                                    Enter your registered email and we'll send you a reset link
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ marginBottom:16 }}>
                                        <label style={{
                                            color:"rgba(255,255,255,0.5)", fontSize:12,
                                            fontFamily:"Poppins, sans-serif", fontWeight:600,
                                            textTransform:"uppercase", letterSpacing:"0.05em",
                                            display:"block", marginBottom:6,
                                        }}>
                                            Email Address
                                        </label>
                                        <StyledInput
                                            type="email"
                                            placeholder="Enter your registered email"
                                            icon={<Mail size={16} color="rgba(255,255,255,0.3)" />}
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); setError(''); }}
                                        />
                                        {error && (
                                            <p style={{ color:"#f87171", fontSize:12, margin:"6px 0 0" }}>{error}</p>
                                        )}
                                    </div>

                                    <button type="submit" disabled={loading} className="fp-btn" style={{
                                        width:"100%",
                                        background: loading
                                            ? "rgba(0,78,146,0.5)"
                                            : `linear-gradient(225deg, ${THEME.start}, ${THEME.stop})`,
                                        border:"none", borderRadius:8, color:"#fff",
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        fontSize:15, fontWeight:600, fontFamily:"Poppins, sans-serif",
                                        padding:"13px 10px", gap:8,
                                        boxShadow:"0 6px 20px rgba(0,0,0,0.25)",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.8 : 1,
                                        marginTop:8,
                                    }}>
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>

                               
                            
                            </>
                        ) : (
                            /* ── Success State ── */
                            <div style={{ textAlign:"center" }}>
                                <div style={{
                                    width:72, height:72, borderRadius:"50%",
                                    background:"rgba(34,197,94,0.15)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    margin:"0 auto 24px",
                                }}>
                                    <CheckCircle size={36} color="#22C55E" />
                                </div>
                                <h1 style={{ color:THEME.color, fontSize:24, fontWeight:700, marginBottom:8 }}>
                                    Email Sent!
                                </h1>
                                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.6, maxWidth:320, margin:"0 auto 32px" }}>
                                    We've sent a password reset link to <br />
                                    <span style={{ color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{email}</span>
                                    <br /><br />
                                    Please check your inbox. The link expires in 15 minutes.
                                </p>
                                <button
                                    className="fp-btn"
                                    onClick={() => { setEmailSent(false); setEmail(''); }}
                                    style={{
                                        background:"rgba(255,255,255,0.06)",
                                        border:"1px solid rgba(255,255,255,0.12)",
                                        borderRadius:8, color:"rgba(255,255,255,0.7)",
                                        fontSize:14, fontWeight:600,
                                        fontFamily:"Poppins, sans-serif",
                                        padding:"11px 24px", cursor:"pointer",
                                        marginBottom:16,
                                    }}
                                >
                                    Resend Email
                                </button>
                                <br />
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}