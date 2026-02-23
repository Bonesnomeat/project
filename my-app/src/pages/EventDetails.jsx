import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";
import { 
    ArrowLeft, Calendar, MapPin, Users, Clock, Globe, 
    Mail, Phone, CheckCircle, Star, Building2
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function EventDetails() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id')) || 1;
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);

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

    const event = dummyEvents.find(e => e.id === eventId) || dummyEvents[0];

    const categoryColors = {
        'Tech': 'bg-blue-100 text-blue-700',
        'Cultural': 'bg-purple-100 text-purple-700',
        'Sports': 'bg-green-100 text-green-700',
        'Workshop': 'bg-orange-100 text-orange-700',
        'Conference': 'bg-indigo-100 text-indigo-700',
    };

    const handleApply = () => {
        if (!isAuthenticated) {
            navigate(createPageUrl('SignIn'));
            return;
        }
        if (userRole === 'sponsor') {
            navigate(createPageUrl('SponsorApply') + `?eventId=${event.id}&package=${selectedPackage || 'Gold'}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} userRole={userRole} />
            
            {/* Hero */}
            <section className="relative h-[400px] overflow-hidden">
                <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto">
                        <Link to={createPageUrl('BrowseEvents')} className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className={categoryColors[event.category]}>{event.category}</Badge>
                            {event.featured && <Badge className="bg-[#F97316] text-white">Featured</Badge>}
                            <Badge variant="outline" className="border-white/50 text-white">Open for Sponsorship</Badge>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{event.title}</h1>
                        <div className="flex flex-wrap gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>{event.expectedAttendees.toLocaleString()} Expected Attendees</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Tabs defaultValue="overview">
                                <TabsList className="mb-8">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="packages">Sponsorship Packages</TabsTrigger>
                                    <TabsTrigger value="organizer">Organizer</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview">
                                    <Card className="p-8">
                                        <h2 className="text-2xl font-bold text-[#1F2937] mb-4">About This Event</h2>
                                        <p className="text-slate-600 leading-relaxed mb-8">{event.description}</p>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="packages">
                                    <div className="space-y-4">
                                        {event.packages?.map((pkg, index) => (
                                            <Card 
                                                key={index}
                                                className={`p-6 cursor-pointer transition-all ${
                                                    selectedPackage === pkg.name 
                                                        ? 'ring-2 ring-[#1E3A8A] shadow-lg' 
                                                        : 'hover:shadow-md'
                                                }`}
                                                onClick={() => setSelectedPackage(pkg.name)}
                                            >
                                                <div className="flex justify-between">
                                                    <h3 className="text-xl font-bold">{pkg.name}</h3>
                                                    <p className="text-2xl font-bold text-green-600">${pkg.price}</p>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="organizer">
                                    <Card className="p-8">
                                        <h3 className="text-2xl font-bold">{event.college}</h3>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-24">
                                <Button onClick={handleApply} className="w-full">
                                    Apply for Sponsorship
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
