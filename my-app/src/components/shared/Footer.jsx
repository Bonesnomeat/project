import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from 'lucide-react';

import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

export default function Footer() {
    return (
        <footer className="bg-[#1E3A8A] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-[#22C55E]" />
                            </div>
                            <span className="text-2xl font-bold">Sponza</span>
                        </div>
                        <p className="text-blue-200 leading-relaxed">
                            Connecting college event organizers with sponsors to create memorable experiences.
                        </p>
                        <div className="flex gap-4 mt-6">
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

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to={createPageUrl('Home')} className="text-blue-200 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('About')} className="text-blue-200 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('BrowseEvents')} className="text-blue-200 hover:text-white transition-colors">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link to={createPageUrl('SignIn')} className="text-blue-200 hover:text-white transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Users */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">For Users</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    For Colleges
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    For Sponsors
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#22C55E]" />
                                <span className="text-blue-200">hello@sponza.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#22C55E]" />
                                <span className="text-blue-200">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#22C55E] mt-0.5" />
                                <span className="text-blue-200">
                                    123 Innovation Drive<br />
                                    San Francisco, CA 94105
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-blue-200 text-sm">
                        © 2024 Sponza. All rights reserved.
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
