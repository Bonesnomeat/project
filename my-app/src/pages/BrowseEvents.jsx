import React, { useState } from 'react';
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Slider } from "C:/Users/USER/sponza/project/my-app/src/components/ui/slider";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Search, SlidersHorizontal, X, MapPin, Calendar } from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import EventCard from '../components/shared/EventCard';
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function BrowseEvents() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [location, setLocation] = useState('all');
    const [budgetRange, setBudgetRange] = useState([0, 100000]);
    const [showFilters, setShowFilters] = useState(false);

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

    const categories = ['All', 'Tech', 'Cultural', 'Sports', 'Workshop', 'Conference'];
    const locations = ['All', 'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Boston'];

    const filteredEvents = dummyEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = category === 'all' || event.category === category;
        const matchesBudget = event.minSponsorship >= budgetRange[0] && event.minSponsorship <= budgetRange[1];
        return matchesSearch && matchesCategory && matchesBudget;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setCategory('all');
        setLocation('all');
        setBudgetRange([0, 100000]);
    };

    const activeFiltersCount = [
        searchQuery !== '',
        category !== 'all',
        location !== 'all',
        budgetRange[0] !== 0 || budgetRange[1] !== 100000
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} userRole={userRole} />
            
            {/* Header */}
            <section className="bg-gradient-to-br from-[#1E3A8A] to-[#1E3A8A]/80 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Browse Events
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                        Discover sponsorship opportunities that align with your brand
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input 
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-white border-0 text-lg"
                            />
                        </div>
                        <Button 
                            onClick={() => setShowFilters(!showFilters)}
                            variant={showFilters ? "default" : "outline"}
                            className={`h-14 px-6 ${showFilters ? 'bg-[#22C55E] hover:bg-[#22C55E]/90' : 'bg-white text-[#1E3A8A] hover:bg-slate-100'}`}
                        >
                            <SlidersHorizontal className="w-5 h-5 mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge className="ml-2 bg-[#F97316] text-white">{activeFiltersCount}</Badge>
                            )}
                        </Button>
                    </div>
                </div>
            </section>

            {showFilters && (
                <div className="bg-white border-b shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-wrap gap-6 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => (
                                            <SelectItem key={loc} value={loc.toLowerCase()}>{loc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 min-w-[280px]">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                    Budget Range: ${budgetRange[0].toLocaleString()} - ${budgetRange[1].toLocaleString()}
                                </label>
                                <Slider
                                    value={budgetRange}
                                    onValueChange={setBudgetRange}
                                    min={0}
                                    max={100000}
                                    step={1000}
                                    className="mt-4"
                                />
                            </div>

                            <Button 
                                variant="ghost" 
                                onClick={clearFilters}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-slate-600">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredEvents.length}</span> events
                        </p>
                        <Select defaultValue="newest">
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                                <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                                <SelectItem value="attendees">Most Attendees</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {filteredEvents.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No events found</h3>
                            <p className="text-slate-600 mb-6">Try adjusting your filters or search query</p>
                            <Button onClick={clearFilters} variant="outline">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
