import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Calendar, PlusCircle, FileText, 
    CreditCard, Settings, Upload, X, Plus, Trash2
} from 'lucide-react';

import { createPageUrl } from "C:/Users/USER/sponza/project/my-app/src/utils";
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';

import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Label } from "C:/Users/USER/sponza/project/my-app/src/components/ui/label";
import { Textarea } from "C:/Users/USER/sponza/project/my-app/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";

export default function CollegeCreateEvent() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
        endDate: '',
        location: '',
        expectedAttendees: '',
        website: '',
    });

    const [packages, setPackages] = useState([
        { name: 'Platinum', price: '', benefits: [''] },
        { name: 'Gold', price: '', benefits: [''] },
    ]);

    const [posterPreview, setPosterPreview] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) {
            navigate(createPageUrl('SignIn'));
            return;
        }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') {
            navigate(createPageUrl('Home'));
            return;
        }
        setUser(parsed);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'CollegeDashboard' },
        { label: 'Create Event', icon: PlusCircle, page: 'CollegeCreateEvent' },
        { label: 'Manage Events', icon: Calendar, page: 'CollegeManageEvents' },
        { label: 'Sponsorship Requests', icon: FileText, page: 'CollegeSponsorshipRequests' },
        { label: 'Payment Records', icon: CreditCard, page: 'CollegePayments' },
        { label: 'Profile Settings', icon: Settings, page: 'CollegeSettings' },
    ];

    const categories = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Conference', 'Hackathon', 'Seminar'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePackageChange = (index, field, value) => {
        const updated = [...packages];
        updated[index][field] = value;
        setPackages(updated);
    };

    const handleBenefitChange = (pkgIndex, benIndex, value) => {
        const updated = [...packages];
        updated[pkgIndex].benefits[benIndex] = value;
        setPackages(updated);
    };

    const addBenefit = (pkgIndex) => {
        const updated = [...packages];
        updated[pkgIndex].benefits.push('');
        setPackages(updated);
    };

    const removeBenefit = (pkgIndex, benIndex) => {
        const updated = [...packages];
        updated[pkgIndex].benefits.splice(benIndex, 1);
        setPackages(updated);
    };

    const addPackage = () => {
        setPackages([...packages, { name: '', price: '', benefits: [''] }]);
    };

    const removePackage = (index) => {
        setPackages(packages.filter((_, i) => i !== index));
    };

    const handlePosterUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(createPageUrl('CollegeManageEvents'));
        }, 1500);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar 
                items={sidebarItems} 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed}
                userRole="college"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader 
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="CollegeSettings"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Create New Event</h1>
                            <p className="text-slate-600 mt-2">
                                Fill in the details to create a new sponsorship opportunity
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* Event Details */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
                                    Event Details
                                </h2>

                                <div className="grid gap-6">

                                    <div>
                                        <Label>Event Title</Label>
                                        <Input
                                            placeholder="Enter event title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Describe your event..."
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            className="mt-1 min-h-[120px]"
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Category</Label>
                                            <Select
                                                value={formData.category}
                                                onValueChange={(v) => handleInputChange('category', v)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Expected Attendees</Label>
                                            <Input
                                                type="number"
                                                placeholder="e.g., 5000"
                                                value={formData.expectedAttendees}
                                                onChange={(e) => handleInputChange('expectedAttendees', e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <Label>Start Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => handleInputChange('date', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label>End Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Location</Label>
                                        <Input
                                            placeholder="Event venue and address"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label>Event Website (Optional)</Label>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.website}
                                            onChange={(e) => handleInputChange('website', e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>

                                </div>
                            </Card>

                            {/* Poster Upload */}
                            <Card className="p-6 mb-6">
                                <h2 className="text-xl font-semibold text-[#1F2937] mb-6">
                                    Event Poster
                                </h2>

                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-[#1E3A8A] transition-colors">

                                    {posterPreview ? (
                                        <div className="relative inline-block">
                                            <img 
                                                src={posterPreview} 
                                                alt="Event poster" 
                                                className="max-h-64 rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPosterPreview(null)}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer">
                                            <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                            <p className="text-lg font-medium text-[#1F2937]">
                                                Upload Event Poster
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                PNG, JPG up to 5MB
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePosterUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}

                                </div>
                            </Card>

                            {/* Submit */}
                            <div className="flex gap-4 justify-end">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => navigate(createPageUrl('CollegeDashboard'))}
                                >
                                    Cancel
                                </Button>

                                <Button 
                                    type="submit" 
                                    className="bg-[#22C55E] hover:bg-[#22C55E]/90 px-8"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Event'}
                                </Button>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
