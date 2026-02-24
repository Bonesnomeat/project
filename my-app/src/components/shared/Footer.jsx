import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from 'lucide-react';
import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";
import logoSrc from 'C:/Users/USER/sponza/project/my-app/public/img/a-sleek-modern-logo-design-featuring-the_goDenOD7TPS-KtuXM3BUnA_RzVYVD7bSjiL0zKDsLJ0uw-Photoroom.png';

export default function Footer() {
    return (
        <footer className="bg-[#1E3A8A] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* ── Main Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* ── Brand ── */}
                    <div className="flex flex-col items-center pl-8">
                        <img
                            src={logoSrc}
                            alt="Sponza logo"
                            style={{ width: 160, height: "auto", objectFit: "contain", marginBottom: 16 }}
                        />
                        <p className="text-blue-200 leading-relaxed text-sm">
                            Connecting college event organizers with sponsors to create memorable experiences.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* ── Quick Links ── */}
                    <div className="flex flex-col items-center pl-8">
                        <h4 className="font-semibold text-lg mb-5 text-white text-center">Quick Links</h4>
                        <ul className="space-y-3 text-center">
                            <li>
                                <Link to={createPageUrl('Home')} className="text-blue-200 hover:text-white transition-colors text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('About')} className="text-blue-200 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('BrowseEvents')} className="text-blue-200 hover:text-white transition-colors text-sm">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('SignIn')} className="text-blue-200 hover:text-white transition-colors text-sm">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('Register')} className="text-blue-200 hover:text-white transition-colors text-sm">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ── Contact ── */}
                    <div className="flex flex-col items-start md:items-center pl-8">
                        <h4 className="font-semibold text-white text-lg mb-5">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#22C55E] shrink-0" />
                                <span className="text-blue-200 text-sm">hello@sponza.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#22C55E] shrink-0" />
                                <span className="text-blue-200 text-sm">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#22C55E] mt-0.5 shrink-0" />
                                <span className="text-blue-200 text-sm">
                                    123 Innovation Drive<br />
                                    San Francisco, CA 94105
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* ── Divider + Bottom Bar ── */}
                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-blue-200 text-sm">
                        © 2026 Sponza. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-blue-200 hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}