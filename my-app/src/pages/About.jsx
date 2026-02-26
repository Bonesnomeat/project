import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";

import { 
  Target, Heart, Globe, Award, Users, Lightbulb,
  CheckCircle, ArrowRight, Quote
} from 'lucide-react';

import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";

import Navbar from "C:/Users/USER/sponza/project/my-app/src/components/shared/Navbar";
import Footer from "C:/Users/USER/sponza/project/my-app/src/components/shared/Footer";


export default function About() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [userRole, setUserRole] = React.useState(null);

    React.useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            const parsed = JSON.parse(auth);
            setIsAuthenticated(true);
            setUserRole(parsed.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    const values = [
        {
            icon: Heart,
            title: 'Passion for Education',
            description: 'We believe in empowering student organizations to create impactful events.',
        },
        {
            icon: Globe,
            title: 'Global Reach',
            description: 'Connecting sponsors and colleges across borders and boundaries.',
        },
        {
            icon: Lightbulb,
            title: 'Innovation First',
            description: 'Using cutting-edge technology to simplify sponsorship matching.',
        },
        {
            icon: Award,
            title: 'Excellence',
            description: 'Committed to delivering exceptional value to all our users.',
        },
    ];

    const team = [
        {
            name: 'Sarah Chen',
            role: 'CEO & Co-Founder',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
        },
        {
            name: 'Michael Roberts',
            role: 'CTO & Co-Founder',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
        },
        {
            name: 'Emily Johnson',
            role: 'Head of Partnerships',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
        },
        {
            name: 'David Kim',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
        },
    ];

    const testimonials = [
        {
            quote: "Sponza transformed how we approach event sponsorship. We raised 3x more funding for our annual tech fest.",
            author: "John Smith",
            role: "Event Director, MIT",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        },
        {
            quote: "Finding the right college events to sponsor used to take weeks. With Sponza, it takes minutes.",
            author: "Lisa Wang",
            role: "Marketing Director, TechCorp",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} userRole={userRole} />
            
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/80 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        About Sponza
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        We're on a mission to revolutionize how college events get sponsored, 
                        creating meaningful connections between students and brands.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 rounded-full mb-6">
                                <Target className="w-4 h-4 text-[#22C55E]" />
                                <span className="text-sm font-medium text-[#22C55E]">Our Mission</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-6">
                                Empowering Student Events, One Sponsorship at a Time
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Founded in 2022, Sponza was born from a simple observation: college event 
                                organizers struggle to find sponsors, while companies miss out on valuable 
                                opportunities to connect with young audiences.
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                We built Sponza to bridge this gap, creating a platform that makes sponsorship 
                                discovery, negotiation, and management seamless for both parties.
                            </p>
                            <div className="space-y-4">
                                {['Trusted by 500+ colleges', 'Over $2.5M in sponsorships facilitated', '200+ brand partners'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                                        <span className="text-[#1F2937] font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                                alt="Team collaboration"
                                className="rounded-2xl shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#22C55E]/10 rounded-2xl -z-10" />
                            <div className="absolute -top-6 -right-6 w-48 h-48 bg-[#1E3A8A]/10 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="w-8 h-8 text-[#1E3A8A]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{value.title}</h3>
                                <p className="text-slate-600">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                            Meet Our Team
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            The passionate people behind Sponza
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-6 inline-block">
                                    <img 
                                        src={member.image}
                                        alt={member.name}
                                        className="w-40 h-40 rounded-2xl object-cover mx-auto group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#1E3A8A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#1F2937]">{member.name}</h3>
                                <p className="text-slate-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-[#1E3A8A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            What Our Users Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="p-8 bg-white/10 backdrop-blur-sm border-0">
                                <Quote className="w-10 h-10 text-[#22C55E] mb-6" />
                                <p className="text-lg text-white mb-6 leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.author}</p>
                                        <p className="text-blue-200 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-slate-600 mb-8">
                        Join the Sponza community and transform your event sponsorship experience.
                    </p>
                    <Link to={createPageUrl('Register')}>
                        <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-8 h-14 text-lg">
                            Create Your Account
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}