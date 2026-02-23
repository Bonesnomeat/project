import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { 
    Sparkles, ArrowRight, Target, Users, TrendingUp, Shield, 
    CheckCircle, Building2, GraduationCap, Zap
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';
import EventCard from '../components/shared/EventCard';

export default function Home() {
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

    const featuredEvents = dummyEvents.filter(e => e.featured).slice(0, 3);

    const stats = [
        { value: '500+', label: 'College Events' },
        { value: '$2.5M', label: 'Sponsorship Raised' },
        { value: '200+', label: 'Active Sponsors' },
        { value: '98%', label: 'Success Rate' },
    ];

    const features = [
        {
            icon: Target,
            title: 'Smart Matching',
            description: 'Our AI-powered algorithm connects sponsors with events that align with their brand values and target audience.',
            color: 'bg-blue-50 text-[#1E3A8A]'
        },
        {
            icon: Shield,
            title: 'Secure Transactions',
            description: 'Safe and transparent payment processing with escrow protection for both parties.',
            color: 'bg-green-50 text-[#22C55E]'
        },
        {
            icon: TrendingUp,
            title: 'Analytics & ROI',
            description: 'Track your sponsorship performance with detailed analytics and ROI measurements.',
            color: 'bg-orange-50 text-[#F97316]'
        },
        {
            icon: Users,
            title: 'Network Growth',
            description: 'Build lasting relationships with colleges and sponsors across the country.',
            color: 'bg-purple-50 text-purple-600'
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} userRole={userRole} />
            
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#22C55E]/30" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&fit=crop')] opacity-10 bg-cover bg-center" />
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-[#22C55E]" />
                                <span className="text-sm font-medium">The #1 Sponsorship Platform</span>
                            </div>
                            
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                                Sponza — Connecting 
                                <span className="text-[#22C55E]"> Ideas </span>
                                with Sponsors
                            </h1>
                            
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                The premier platform connecting college event organizers with sponsors. 
                                Create memorable events with the backing they deserve.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                
                                <Link to={createPageUrl('BrowseEvents')}>
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-blue-500 hover:bg-white hover:text-[#1E3A8A] px-8 h-14 text-lg">
                                        Browse Events
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:gap-6">
                            {stats.map((stat, index) => (
                                <Card key={index} className="p-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
                                    <p className="text-3xl lg:text-4xl font-bold text-[#1E3A8A]">{stat.value}</p>
                                    <p className="text-slate-600 mt-1">{stat.label}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                            How Sponza Works
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Simple, transparent, and effective sponsorship matching in three easy steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: GraduationCap, title: 'Create Event', desc: 'Colleges list their events with sponsorship packages and reach requirements.' },
                            { icon: Building2, title: 'Match & Connect', desc: 'Sponsors discover events that align with their brand and apply for packages.' },
                            { icon: Zap, title: 'Collaborate', desc: 'Seamless communication and secure payments make partnerships a breeze.' },
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-[#1E3A8A]/10 rounded-2xl flex items-center justify-center mb-6 relative">
                                        <step.icon className="w-10 h-10 text-[#1E3A8A]" />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1F2937] mb-3">{step.title}</h3>
                                    <p className="text-slate-600">{step.desc}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#1E3A8A]/20 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-4">
                            Why Choose Sponza?
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Everything you need to create successful sponsorship partnerships
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#1F2937] mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2937] mb-2">
                                Featured Events
                            </h2>
                            <p className="text-slate-600">Discover top sponsorship opportunities</p>
                        </div>
                        <Link to={createPageUrl('BrowseEvents')}>
                            <Button variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white">
                                View All Events
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Ready to Transform Your Event Sponsorship?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join hundreds of colleges and sponsors already using Sponza to create meaningful partnerships.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={createPageUrl('Register')}>
                            <Button size="lg" className="bg-[#22C55E] hover:bg-[#22C55E]/90 text-white px-8 h-14 text-lg">
                                Start Free Trial
                            </Button>
                        </Link>
                        <Link to={createPageUrl('About')}>
                            <Button size="lg" variant="outline" className="border-white text-blue-500 hover:bg-white hover:text-[#1E3A8A] px-8 h-14 text-lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
