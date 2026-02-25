import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";
import logoSrc from 'C:/Users/USER/sponza/project/my-app/public/img/a-sleek-modern-logo-design-featuring-the_goDenOD7TPS-KtuXM3BUnA_RzVYVD7bSjiL0zKDsLJ0uw-Photoroom.png';

const THEME = {
    start: "#004e92",
    stop: "#000d7a",
    bgColor: "#00052d",
    color: "rgba(255,255,255,0.8)",
    inputBg: "rgba(0,0,0,0.4)",
    inputFocusBg: "rgba(0,0,0,0.5)",
    placeholderColor: "rgba(255,255,255,0.7)",
};

function StyledInput({ placeholder, icon, value, onChange, showToggle, onToggle, showPassword }) {
    const [focused, setFocused] = useState(false);
    const inputType = showToggle ? (showPassword ? 'text' : 'password') : 'password';
    const uid = `rp-input-${placeholder?.replace(/\s+/g, '-')}`;
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
                type={inputType}
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
                    padding: "11px 40px 11px 38px",
                    fontFamily: "Poppins, sans-serif",
                    outline: "none",
                    transition: "all 250ms ease-in-out",
                    boxSizing: "border-box",
                }}
            />
            {showToggle && (
                <button type="button" onClick={onToggle} style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", display: "flex",
                    alignItems: "center", color: "rgba(255,255,255,0.4)",
                }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    );
}

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(null); // null = checking

    // ✅ Read token and email from URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');

    // ✅ Validate token on mount
    useEffect(() => {
        const resetData = localStorage.getItem('sponza_reset');
        if (!resetData) {
            setTokenValid(false);
            return;
        }
        const parsed = JSON.parse(resetData);

        // Check token matches and not expired
        if (
            parsed.token === urlToken &&
            parsed.email === urlEmail &&
            Date.now() < parsed.expiry
        ) {
            setTokenValid(true);
        } else {
            setTokenValid(false);
        }
    }, [urlToken, urlEmail]);

    const validatePassword = () => {
        const e = {};
        if (!password) {
            e.password = 'Password is required';
        } else if (password.length < 8) {
            e.password = 'Minimum 8 characters required';
        } else if (!/[A-Z]/.test(password)) {
            e.password = 'Must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(password)) {
            e.password = 'Must contain at least one number';
        } else if (!/[!@#$%^&*]/.test(password)) {
            e.password = 'Must contain at least one special character (!@#$%^&*)';
        }

        if (!confirmPassword) {
            e.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            e.confirmPassword = 'Passwords do not match';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoading(true);

        setTimeout(() => {
            // ✅ Update password in localStorage for this user
            const auth = localStorage.getItem('sponza_auth');
            if (auth) {
                const parsed = JSON.parse(auth);
                if (parsed.email === urlEmail) {
                    parsed.password = password;
                    localStorage.setItem('sponza_auth', JSON.stringify(parsed));
                }
            }

            // ✅ Clear reset token so link can't be reused
            localStorage.removeItem('sponza_reset');

            setSuccess(true);
            setLoading(false);

            // Redirect to login after 3 seconds
            setTimeout(() => navigate(createPageUrl('SignIn')), 3000);
        }, 1500);
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
                .rp-btn:hover{opacity:0.85;transform:translateY(-1px)}
                .rp-btn{transition:opacity 200ms,transform 200ms}
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
                                Create a strong new password for your account.
                            </p>
                            <div style={{ width:45, height:2, background:"rgba(255,255,255,0.3)", borderRadius:2, margin:"20px auto 0" }} />
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div style={{
                        flex:1, backgroundColor: THEME.bgColor,
                        display:"flex", flexDirection:"column", justifyContent:"center",
                        padding:"48px 44px",
                    }}>

                        {/* Checking token */}
                        {tokenValid === null && (
                            <p style={{ color:"rgba(255,255,255,0.5)", textAlign:"center", fontSize:14 }}>
                                Validating reset link...
                            </p>
                        )}

                        {/* Invalid / Expired token */}
                        {tokenValid === false && (
                            <div style={{ textAlign:"center" }}>
                                <div style={{
                                    width:72, height:72, borderRadius:"50%",
                                    background:"rgba(239,68,68,0.15)",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    margin:"0 auto 24px",
                                }}>
                                    <XCircle size={36} color="#ef4444" />
                                </div>
                                <h1 style={{ color:THEME.color, fontSize:22, fontWeight:700, marginBottom:8 }}>
                                    Link Expired or Invalid
                                </h1>
                                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, marginBottom:28 }}>
                                    This reset link has expired or already been used.<br />
                                    Please request a new one.
                                </p>
                                <Link to={createPageUrl('ForgotPassword')} style={{
                                    display:"inline-block",
                                    background:`linear-gradient(225deg, ${THEME.start}, ${THEME.stop})`,
                                    color:"#fff", textDecoration:"none",
                                    padding:"12px 28px", borderRadius:8,
                                    fontWeight:600, fontSize:14,
                                }}>
                                    Request New Link
                                </Link>
                            </div>
                        )}

                        {/* Valid token — show form */}
                        {tokenValid === true && !success && (
                            <>
                                <h1 style={{ color:THEME.color, fontSize:26, fontWeight:700, letterSpacing:"-0.5px", marginBottom:4, textAlign:"center" }}>
                                    Reset Password
                                </h1>
                                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:32, textAlign:"center" }}>
                                    Enter your new password below
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

                                        <div>
                                            <label style={{
                                                color:"rgba(255,255,255,0.5)", fontSize:12,
                                                fontWeight:600, textTransform:"uppercase",
                                                letterSpacing:"0.05em", display:"block", marginBottom:6,
                                            }}>
                                                New Password
                                            </label>
                                            <StyledInput
                                                placeholder="Min 8 chars, uppercase, number, special char"
                                                icon={<Lock size={16} color="rgba(255,255,255,0.3)" />}
                                                value={password}
                                                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                                                showToggle
                                                onToggle={() => setShowPassword(!showPassword)}
                                                showPassword={showPassword}
                                            />
                                            {errors.password && (
                                                <p style={{ color:"#f87171", fontSize:12, margin:"6px 0 0" }}>{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label style={{
                                                color:"rgba(255,255,255,0.5)", fontSize:12,
                                                fontWeight:600, textTransform:"uppercase",
                                                letterSpacing:"0.05em", display:"block", marginBottom:6,
                                            }}>
                                                Confirm New Password
                                            </label>
                                            <StyledInput
                                                placeholder="Confirm your new password"
                                                icon={<Lock size={16} color="rgba(255,255,255,0.3)" />}
                                                value={confirmPassword}
                                                onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: '' })); }}
                                                showToggle
                                                onToggle={() => setShowConfirm(!showConfirm)}
                                                showPassword={showConfirm}
                                            />
                                            {errors.confirmPassword && (
                                                <p style={{ color:"#f87171", fontSize:12, margin:"6px 0 0" }}>{errors.confirmPassword}</p>
                                            )}
                                        </div>

                                    </div>

                                    <button type="submit" disabled={loading} className="rp-btn" style={{
                                        marginTop:24, width:"100%",
                                        background: loading
                                            ? "rgba(34,197,94,0.5)"
                                            : "linear-gradient(225deg, #16a34a, #15803d)",
                                        border:"none", borderRadius:8, color:"#fff",
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        fontSize:15, fontWeight:600, fontFamily:"Poppins, sans-serif",
                                        padding:"13px 10px",
                                        boxShadow:"0 6px 20px rgba(0,0,0,0.25)",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        opacity: loading ? 0.8 : 1,
                                    }}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            </>
                        )}

                        {/* Success state */}
                        {success && (
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
                                    Password Reset!
                                </h1>
                                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, lineHeight:1.6, marginBottom:8 }}>
                                    Your password has been updated successfully.
                                </p>
                                <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>
                                    Redirecting to login in 3 seconds...
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}