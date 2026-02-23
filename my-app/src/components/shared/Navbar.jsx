import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";

import { Menu, X, Sparkles } from 'lucide-react';

import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

export default function Navbar({ isAuthenticated, onLogout, userRole }) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const getDashboardUrl = () => {
        if (userRole === 'college') return createPageUrl('CollegeDashboard');
        if (userRole === 'sponsor') return createPageUrl('SponsorDashboard');
        if (userRole === 'admin') return createPageUrl('AdminPanel');
        return createPageUrl('Home');
    };

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[#1E3A8A]">Sponza</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to={createPageUrl('Home')} className="text-[#1F2937] hover:text-[#1E3A8A] transition-colors font-medium">
                            Home
                        </Link>
                        <Link to={createPageUrl('About')} className="text-[#1F2937] hover:text-[#1E3A8A] transition-colors font-medium">
                            About
                        </Link>
                        <Link to={createPageUrl('BrowseEvents')} className="text-[#1F2937] hover:text-[#1E3A8A] transition-colors font-medium">
                            Browse Events
                        </Link>
                    </div>

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

                    <button 
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

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
