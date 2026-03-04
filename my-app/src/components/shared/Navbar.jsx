import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Menu, X } from 'lucide-react';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

// ─── Animated Logout Button Styles ───────────────────────────────────────────
const logoutBtnCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');

  .logout-btn {
    --figure-duration: 100;
    --transform-figure: none;
    --walking-duration: 100;
    --transform-arm1: none;
    --transform-wrist1: none;
    --transform-arm2: none;
    --transform-wrist2: none;
    --transform-leg1: none;
    --transform-calf1: none;
    --transform-leg2: none;
    --transform-calf2: none;
    background: none;
    border: 0;
    cursor: pointer;
    display: block;
    font-family: "Quicksand", sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    outline: none;
    padding: 0 0 0 20px;
    perspective: 100px;
    position: relative;
    text-align: left;
    width: 130px;
    -webkit-tap-highlight-color: transparent;
  }
  .logout-btn::before {
    background-color:white;
    border-radius: 5px;
    content: "";
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: none;
    transition: transform 50ms ease;
    width: 100%;
    z-index: 2;
  }
  .logout-btn:hover .logout-door { transform: rotateY(20deg); }
  .logout-btn:active::before { transform: scale(0.96); }
  .logout-btn:active .logout-door { transform: rotateY(28deg); }
  .logout-btn.clicked::before { transform: none; }
  .logout-btn.clicked .logout-door { transform: rotateY(35deg); }
  .logout-btn.door-slammed .logout-door {
    transform: none;
    transition: transform 100ms ease-in 250ms;
  }
  .logout-btn.falling { animation: logout-shake 200ms linear; }
  .logout-btn.falling .logout-bang { animation: logout-flash 300ms linear; }
  .logout-btn.falling .logout-figure {
    animation: logout-spin 1000ms infinite linear;
    bottom: -1080px;
    opacity: 0;
    right: 1px;
    transition:
      transform calc(var(--figure-duration) * 1ms) linear,
      bottom calc(var(--figure-duration) * 1ms) cubic-bezier(0.7, 0.1, 1, 1) 100ms,
      opacity calc(var(--figure-duration) * 0.25ms) linear calc(var(--figure-duration) * 0.75ms);
    z-index: 1;
  }
  .logout-btn-text {
    color: #1E3A8A;
    text-decoration: bold;
    font-weight: 500;
    position: relative;
    z-index: 10;
  }
  .logout-btn svg { display: block; position: absolute; }
  .logout-figure {
    bottom: 5px; fill: #1f2335; right: 18px;
    transform: var(--transform-figure);
    transition: transform calc(var(--figure-duration) * 1ms) cubic-bezier(0.2, 0.1, 0.8, 0.9);
    width: 30px; z-index: 4;
  }
  .logout-door, .logout-doorway { bottom: 4px; fill: #ffffff; right: 12px; width: 32px; }
  .logout-door {
    transform: rotateY(20deg);
    transform-origin: 100% 50%;
    transform-style: preserve-3d;
    transition: transform 200ms ease;
    z-index: 5;
  }
  .logout-door path { fill: brown; stroke: #1f2335; stroke-width: 3; }
  .logout-doorway { z-index: 3; }
  .logout-doorway path { fill: brown; }
  .logout-bang { opacity: 0; fill: brown; }
  .logout-arm1, .logout-wrist1, .logout-arm2, .logout-wrist2,
  .logout-leg1, .logout-calf1, .logout-leg2, .logout-calf2 {
    transition: transform calc(var(--walking-duration) * 1ms) ease-in-out;
  }
  .logout-arm1   { transform: var(--transform-arm1);   transform-origin: 52% 45%; }
  .logout-wrist1 { transform: var(--transform-wrist1); transform-origin: 59% 55%; }
  .logout-arm2   { transform: var(--transform-arm2);   transform-origin: 47% 43%; }
  .logout-wrist2 { transform: var(--transform-wrist2); transform-origin: 35% 47%; }
  .logout-leg1   { transform: var(--transform-leg1);   transform-origin: 47% 64.5%; }
  .logout-calf1  { transform: var(--transform-calf1);  transform-origin: 55.5% 71.5%; }
  .logout-leg2   { transform: var(--transform-leg2);   transform-origin: 43% 63%; }
  .logout-calf2  { transform: var(--transform-calf2);  transform-origin: 41.5% 73%; }
  @keyframes logout-spin {
    from { transform: rotate(0deg) scale(0.94); }
    to   { transform: rotate(359deg) scale(0.94); }
  }
  @keyframes logout-shake {
    0%   { transform: rotate(-1deg); }
    50%  { transform: rotate(2deg); }
    100% { transform: rotate(-1deg); }
  }
  @keyframes logout-flash {
    0%   { opacity: 0.4; }
    100% { opacity: 0; }
  }
`;

const LOGOUT_STATES = {
  default: {
    '--figure-duration': '100', '--transform-figure': 'none',
    '--walking-duration': '100', '--transform-arm1': 'none',
    '--transform-wrist1': 'none', '--transform-arm2': 'none',
    '--transform-wrist2': 'none', '--transform-leg1': 'none',
    '--transform-calf1': 'none', '--transform-leg2': 'none', '--transform-calf2': 'none',
  },
  hover: {
    '--figure-duration': '100', '--transform-figure': 'translateX(1.5px)',
    '--walking-duration': '100', '--transform-arm1': 'rotate(-5deg)',
    '--transform-wrist1': 'rotate(-15deg)', '--transform-arm2': 'rotate(5deg)',
    '--transform-wrist2': 'rotate(6deg)', '--transform-leg1': 'rotate(-10deg)',
    '--transform-calf1': 'rotate(5deg)', '--transform-leg2': 'rotate(20deg)',
    '--transform-calf2': 'rotate(-20deg)',
  },
  walking1: {
    '--figure-duration': '300', '--transform-figure': 'translateX(11px)',
    '--walking-duration': '300', '--transform-arm1': 'translateX(-4px) translateY(-2px) rotate(120deg)',
    '--transform-wrist1': 'rotate(-5deg)', '--transform-arm2': 'translateX(4px) rotate(-110deg)',
    '--transform-wrist2': 'rotate(-5deg)', '--transform-leg1': 'translateX(-3px) rotate(80deg)',
    '--transform-calf1': 'rotate(-30deg)', '--transform-leg2': 'translateX(4px) rotate(-60deg)',
    '--transform-calf2': 'rotate(20deg)',
  },
  walking2: {
    '--figure-duration': '400', '--transform-figure': 'translateX(17px)',
    '--walking-duration': '300', '--transform-arm1': 'rotate(60deg)',
    '--transform-wrist1': 'rotate(-15deg)', '--transform-arm2': 'rotate(-45deg)',
    '--transform-wrist2': 'rotate(6deg)', '--transform-leg1': 'rotate(-5deg)',
    '--transform-calf1': 'rotate(10deg)', '--transform-leg2': 'rotate(10deg)',
    '--transform-calf2': 'rotate(-20deg)',
  },
  falling1: {
    '--figure-duration': '1600', '--walking-duration': '400',
    '--transform-arm1': 'rotate(-60deg)', '--transform-wrist1': 'none',
    '--transform-arm2': 'rotate(30deg)', '--transform-wrist2': 'rotate(120deg)',
    '--transform-leg1': 'rotate(-30deg)', '--transform-calf1': 'rotate(-20deg)',
    '--transform-leg2': 'rotate(20deg)',
  },
  falling2: {
    '--walking-duration': '300', '--transform-arm1': 'rotate(-100deg)',
    '--transform-arm2': 'rotate(-60deg)', '--transform-wrist2': 'rotate(60deg)',
    '--transform-leg1': 'rotate(80deg)', '--transform-calf1': 'rotate(20deg)',
    '--transform-leg2': 'rotate(-60deg)',
  },
  falling3: {
    '--walking-duration': '500', '--transform-arm1': 'rotate(-30deg)',
    '--transform-wrist1': 'rotate(40deg)', '--transform-arm2': 'rotate(50deg)',
    '--transform-wrist2': 'none', '--transform-leg1': 'rotate(-30deg)',
    '--transform-leg2': 'rotate(20deg)', '--transform-calf2': 'none',
  },
};

// ─── Animated Logout Button Component ────────────────────────────────────────
function LogoutButton({ onLogout }) {
  const btnRef = useRef(null);
  const stateRef = useRef('default');

  const applyState = (stateName) => {
    const btn = btnRef.current;
    if (!btn || !LOGOUT_STATES[stateName]) return;
    stateRef.current = stateName;
    for (const [key, val] of Object.entries(LOGOUT_STATES[stateName])) {
      btn.style.setProperty(key, val);
    }
  };

  const handleMouseEnter = () => {
    if (stateRef.current === 'default') applyState('hover');
  };

  const handleMouseLeave = () => {
    if (stateRef.current === 'hover') applyState('default');
  };

  const handleClick = () => {
    const btn = btnRef.current;
    if (!btn) return;
    if (stateRef.current !== 'default' && stateRef.current !== 'hover') return;

    btn.classList.add('clicked');
    applyState('walking1');

    setTimeout(() => {
      btn.classList.add('door-slammed');
      applyState('walking2');
      setTimeout(() => {
        btn.classList.add('falling');
        applyState('falling1');
        setTimeout(() => {
          applyState('falling2');
          setTimeout(() => {
            applyState('falling3');
            setTimeout(() => {
              btn.classList.remove('clicked', 'door-slammed', 'falling');
              applyState('default');
              if (onLogout) onLogout();
            }, 1000);
          }, Number(LOGOUT_STATES.falling2['--walking-duration']));
        }, Number(LOGOUT_STATES.falling1['--walking-duration']));
      }, Number(LOGOUT_STATES.walking2['--figure-duration']));
    }, Number(LOGOUT_STATES.walking1['--figure-duration']));
  };

  return (
    <button
      ref={btnRef}
      className="logout-btn"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label="Log out"
    >
      {/* Doorway (back wall) */}
      <svg className="logout-doorway" viewBox="0 0 100 100">
        <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
        <path className="logout-bang" d="M40.5 43.7L26.6 31.4l-2.5 6.7zM41.9 50.4l-19.5-4-1.4 6.3zM40 57.4l-17.7 3.9 3.9 5.7z" />
      </svg>
      {/* Walking figure */}
      <svg className="logout-figure" viewBox="0 0 100 100">
        <circle cx="52.1" cy="32.4" r="6.4" />
        <path d="M50.7 62.8c-1.2 2.5-3.6 5-7.2 4-3.2-.9-4.9-3.5-4-7.8.7-3.4 3.1-13.8 4.1-15.8 1.7-3.4 1.6-4.6 7-3.7 4.3.7 4.6 2.5 4.3 5.4-.4 3.7-2.8 15.1-4.2 17.9z" />
        <g className="logout-arm1">
          <path d="M55.5 56.5l-6-9.5c-1-1.5-.6-3.5.9-4.4 1.5-1 3.7-1.1 4.6.4l6.1 10c1 1.5.3 3.5-1.1 4.4-1.5.9-3.5.5-4.5-.9z" />
          <path className="logout-wrist1" d="M69.4 59.9L58.1 58c-1.7-.3-2.9-1.9-2.6-3.7.3-1.7 1.9-2.9 3.7-2.6l11.4 1.9c1.7.3 2.9 1.9 2.6 3.7-.4 1.7-2 2.9-3.8 2.6z" />
        </g>
        <g className="logout-arm2">
          <path d="M34.2 43.6L45 40.3c1.7-.6 3.5.3 4 2 .6 1.7-.3 4-2 4.5l-10.8 2.8c-1.7.6-3.5-.3-4-2-.6-1.6.3-3.4 2-4z" />
          <path className="logout-wrist2" d="M27.1 56.2L32 45.7c.7-1.6 2.6-2.3 4.2-1.6 1.6.7 2.3 2.6 1.6 4.2L33 58.8c-.7 1.6-2.6 2.3-4.2 1.6-1.7-.7-2.4-2.6-1.7-4.2z" />
        </g>
        <g className="logout-leg1">
          <path d="M52.1 73.2s-7-5.7-7.9-6.5c-.9-.9-1.2-3.5-.1-4.9 1.1-1.4 3.8-1.9 5.2-.9l7.9 7c1.4 1.1 1.7 3.5.7 4.9-1.1 1.4-4.4 1.5-5.8.4z" />
          <path className="logout-calf1" d="M52.6 84.4l-1-12.8c-.1-1.9 1.5-3.6 3.5-3.7 2-.1 3.7 1.4 3.8 3.4l1 12.8c.1 1.9-1.5 3.6-3.5 3.7-2 0-3.7-1.5-3.8-3.4z" />
        </g>
        <g className="logout-leg2">
          <path d="M37.8 72.7s1.3-10.2 1.6-11.4 2.4-2.8 4.1-2.6c1.7.2 3.6 2.3 3.4 4l-1.8 11.1c-.2 1.7-1.7 3.3-3.4 3.1-1.8-.2-4.1-2.4-3.9-4.2z" />
          <path className="logout-calf2" d="M29.5 82.3l9.6-10.9c1.3-1.4 3.6-1.5 5.1-.1 1.5 1.4.4 4.9-.9 6.3l-8.5 9.6c-1.3 1.4-3.6 1.5-5.1.1-1.4-1.3-1.5-3.5-.2-5z" />
        </g>
      </svg>
      {/* Door (front) */}
      <svg className="logout-door" viewBox="0 0 100 100">
        <path d="M93.4 86.3H58.6c-1.9 0-3.4-1.5-3.4-3.4V17.1c0-1.9 1.5-3.4 3.4-3.4h34.8c1.9 0 3.4 1.5 3.4 3.4v65.8c0 1.9-1.5 3.4-3.4 3.4z" />
        <circle cx="66" cy="50" r="3.7" />
      </svg>
      <span className="logout-btn-text"  >Log Out</span>
    </button>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar({ isAuthenticated, onLogout, userRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const getDashboardUrl = () => {
    if (userRole === 'college') return createPageUrl('CollegeDashboard');
    if (userRole === 'sponsor') return createPageUrl('SponsorDashboard');
    if (userRole === 'admin') return createPageUrl('AdminPanel');
    return createPageUrl('Home');
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const footer = document.getElementById('footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{logoutBtnCSS}</style>
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center">
              <img
                src="/img/sponza_logo_dark_blue.png"
                alt="Sponza logo"
                style={{ height: '130px', width: '200px', objectFit: 'contain', alignItems: 'left' }}
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('Home')} className="text-[#1F2937] hover:text-[#1E3A8A] transition-colors font-medium">
                Home
              </Link>
              <Link to={createPageUrl('About')} className="text-[#1F2937] hover:text-[#1E3A8A] transition-colors font-medium">
                About
              </Link>
              <a
                href="#footer"
                onClick={handleContactClick}
                className="text-[#1F2937] hover:text-[#1E3A8A] transition-colors font-medium cursor-pointer"
              >
                Contact
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardUrl()}>
                    <Button variant="ghost" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/5">
                      Dashboard
                    </Button>
                  </Link>
                  {/* ✅ Animated Logout Button */}
                  <LogoutButton onLogout={onLogout} />
                </>
              ) : (
                <>
                  <Link to={createPageUrl('SignIn')}>
                    <Button variant="ghost" className="text-[#1E3A8A] hover:bg-[#1E3A8A]/5">
                      Login
                    </Button>
                  </Link>
                  <Link to={createPageUrl('Register')}>
                    <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100">
              <div className="flex flex-col gap-3">
                <Link to={createPageUrl('Home')} className="px-3 py-2 text-[#1F2937] hover:bg-slate-50 rounded-lg">
                  Home
                </Link>
                <Link to={createPageUrl('About')} className="px-3 py-2 text-[#1F2937] hover:bg-slate-50 rounded-lg">
                  About
                </Link>
                <Link to={createPageUrl('BrowseEvents')} className="px-3 py-2 text-[#1F2937] hover:bg-slate-50 rounded-lg">
                  Browse Events
                </Link>
                <a
                  href="#footer"
                  onClick={handleContactClick}
                  className="px-3 py-2 text-[#1F2937] hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  Contact
                </a>
                <hr className="my-2" />
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardUrl()} className="px-3 py-2 text-[#1E3A8A] font-medium hover:bg-slate-50 rounded-lg">
                      Dashboard
                    </Link>
                    {/* ✅ Animated Logout Button (mobile) */}
                    <div className="px-3">
                      <LogoutButton onLogout={() => { setMobileMenuOpen(false); onLogout(); }} />
                    </div>
                  </>
                ) : (
                  <>
                    <Link to={createPageUrl('SignIn')} className="px-3 py-2 text-[#1E3A8A] font-medium hover:bg-slate-50 rounded-lg">
                      Login
                    </Link>
                    <Link to={createPageUrl('Register')} className="px-3 py-2 bg-[#1E3A8A] text-white text-center rounded-lg">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}