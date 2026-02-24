import { useState } from "react";
import "./App.css";
import logoSrc from "/img/a-sleek-modern-logo-design-featuring-the_goDenOD7TPS-KtuXM3BUnA_RzVYVD7bSjiL0zKDsLJ0uw-Photoroom.png";

const THEME = {
  start: "#004e92",
  stop: "#000d7a",
  bgColor: "#00052d",
  color: "rgba(255,255,255,0.8)",
  inputBg: "rgba(0,0,0,0.4)",
  inputIconColor: "rgba(255,255,255,0.3)",
  inputFocusIconColor: "#24b7ff",
  inputFocusBg: "rgba(0,0,0,0.5)",
  placeholderColor: "rgba(255,255,255,0.7)",
  submitColor: "#fff",
};

// --- SVG Icon Components ---
const UserIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const KeyIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.65 10A6 6 0 1 0 13 10h7V8h-2V4h-2v4h-3.35zM7 10a4 4 0 1 1 4 4 4 4 0 0 1-4-4z" />
  </svg>
);

const ArrowIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
  </svg>
);

// --- InputField Component ---
function InputField({ type, placeholder, icon }) {
  const [focused, setFocused] = useState(false);
  const uid = `login-input-${type}`;

  return (
    <div style={{ marginBottom: 15, position: "relative" }}>
      <style>{`.${uid}::placeholder { color: ${THEME.placeholderColor}; opacity: 1; }`}</style>
      <input
        type={type}
        placeholder={placeholder}
        className={uid}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          backgroundColor: focused ? THEME.inputFocusBg : THEME.inputBg,
          border: "none",
          borderRadius: 6,
          color: THEME.color,
          fontSize: 16,
          padding: "14px 44px 14px 12px",
          fontFamily: "Poppins, sans-serif",
          outline: "none",
          transition: "all 250ms ease-in-out",
          boxSizing: "border-box",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: 13,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon === "user"
          ? <UserIcon color={focused ? THEME.inputFocusIconColor : THEME.inputIconColor} />
          : <KeyIcon color={focused ? THEME.inputFocusIconColor : THEME.inputIconColor} />}
      </span>
    </div>
  );
}

// --- Login Component ---
function Login() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(14px) scale(0.97); }
        }
        .orb1 { animation: float1 6s ease-in-out infinite; }
        .orb2 { animation: float2 8s ease-in-out infinite; }
        .orb3 { animation: float1 10s ease-in-out infinite 2s; }

        .signin-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .signin-btn { transition: opacity 200ms, transform 200ms; }
      `}</style>

      {/* Full-page background */}
      <div
        style={{
          backgroundColor: THEME.bgColor,
          minHeight: "91vh",
          width: "80vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Poppins, sans-serif",
          padding: "24px",
        }}
      >
        {/* Laptop-sized card: two-column split */}
        <div
          style={{
            display: "flex",
            width: "min(900px, 100%)",
            minHeight: 520,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
          }}
        >
          {/* LEFT PANEL: decorative branding */}
          <div
            style={{
              flex: "0 0 45%",
              background: `linear-gradient(225deg, ${THEME.start} 16%, ${THEME.stop} 100%)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative blurred orbs */}
            <div className="orb1" style={{
              position: "absolute", top: "10%", left: "10%",
              width: 160, height: 160, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)", filter: "blur(2px)",
            }} />
            <div className="orb2" style={{
              position: "absolute", bottom: "12%", right: "8%",
              width: 220, height: 220, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)", filter: "blur(4px)",
            }} />
            <div className="orb3" style={{
              position: "absolute", top: "55%", left: "30%",
              width: 90, height: 90, borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }} />

            {/* Brand content */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>

              {/* LOGO — bare image, no box wrapper */}
              <img
                src={logoSrc}
                alt="Sponza logo"
                style={{
                  width: 280,
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto 10px",
                }}
              />

            <p align="" style={{
                color: "rgba(255,255,255,0.65)", fontSize: 14,
                lineHeight: 1, maxWidth: 290,
              }}>
                  Fueling Events. Empowering Ideas
              </p>

              <div style={{
                width: 45, height: 2, background: "rgba(255,255,255,0.3)",
                borderRadius: 2, margin: "10px auto 0",
              }} />
            </div>
          </div>

          {/* RIGHT PANEL: login form */}
          <div
            style={{
              flex: 1,
              backgroundColor: THEME.bgColor,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "36px 44px 32px",
            }}
          >
            {/* Top spacer — no theme picker anymore */}
            <div />

            {/* Middle: Form fields */}
            <div style={{ marginTop: 32 }}>
              <h1 style={{
                color: THEME.color, fontSize: 30, fontWeight: 700,
                letterSpacing: "-0.5px", marginBottom: 6,
              }}>
                Welcome
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 36 }}>
                Enter your credentials to continue.
              </p>

              <InputField type="text" placeholder="Enter your username" icon="user" />
              <InputField type="password" placeholder="Enter your password" icon="key" />

              <div style={{ textAlign: "right", marginTop: -6, marginBottom: 28 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer" }}>
                  Forgot password?
                </span>
              </div>

              <button
                type="button"
                className="signin-btn"
                style={{
                  background: `linear-gradient(225deg, ${THEME.start}, ${THEME.stop})`,
                  border: "none", borderRadius: 8, color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 600, fontFamily: "Poppins, sans-serif",
                  padding: "14px 10px", width: "100%", gap: 8,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                }}
              >
                Sign In
                <ArrowIcon color="#fff" />
              </button>
            </div>

            {/* Bottom: sign-up nudge */}
            <p style={{
              color: "rgba(255,255,255,0.3)", fontSize: 13,
              textAlign: "center", marginTop: 32,
            }}>
              Don't have an account?{" "}
              <span style={{ color: "rgba(255,255,255,0.65)", cursor: "pointer" }}>
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
