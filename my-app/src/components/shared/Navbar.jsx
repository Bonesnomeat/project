import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Menu, X } from 'lucide-react';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";


export default function Navbar({ isAuthenticated, onLogout, userRole }) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const getDashboardUrl = () => {
        if (userRole === 'college') return createPageUrl('CollegeDashboard');
        if (userRole === 'sponsor') return createPageUrl('SponsorDashboard');
        if (userRole === 'admin') return createPageUrl('AdminPanel');
        return createPageUrl('Home');
    };

    // 👇 Scrolls to footer when Contact is clicked
    const handleContactClick = (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const footer = document.getElementById('footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
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

                        {/* 👇 Changed from Link to <a> to trigger scroll */}
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
                                <Button
                                    onClick={onLogout}
                                    variant="outline"
                                    className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
                                >
                                    Logout
                                </Button>
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

                            {/* 👇 Mobile Contact scroll added */}
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
                                    <button
                                        onClick={onLogout}
                                        className="px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        Logout
                                    </button>
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
    );
}