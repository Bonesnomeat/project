import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Search, Calendar, History, 
    Settings, User, Building2, Bell, Lock, Camera, Globe
} from 'lucide-react';

import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';

import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';

import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Label } from "C:/Users/USER/sponza/project/my-app/src/components/ui/label";
import { Textarea } from "C:/Users/USER/sponza/project/my-app/src/components/ui/textarea";
import { Switch } from "C:/Users/USER/sponza/project/my-app/src/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "C:/Users/USER/sponza/project/my-app/src/components/ui/avatar";

export default function SponsorSettings() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) {
            navigate(createPageUrl('SignIn'));
            return;
        }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') {
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
        { label: 'Dashboard', icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events', icon: Search, page: 'SponsorBrowseEvents' },
        { label: 'My Applications', icon: Calendar, page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History, page: 'SponsorHistory' },
        { label: 'Profile Settings', icon: Settings, page: 'SponsorSettings' },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar 
                items={sidebarItems} 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed}
                userRole="sponsor"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader 
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="SponsorSettings"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
                            <p className="text-slate-600 mt-1">Manage your profile and preferences</p>
                        </div>

                        <Tabs defaultValue="profile">
                            <TabsList className="mb-6">
                                <TabsTrigger value="profile">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="company">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Company
                                </TabsTrigger>
                                <TabsTrigger value="preferences">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Preferences
                                </TabsTrigger>
                                <TabsTrigger value="security">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Security
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card className="p-6">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <Avatar className="w-24 h-24">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-[#1E3A8A] text-white text-2xl">
                                                    {user.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#1F2937]">{user.name}</h3>
                                            <p className="text-slate-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Full Name</Label>
                                                <Input defaultValue={user.name} className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <Input defaultValue={user.email} className="mt-1" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Phone</Label>
                                                <Input defaultValue="+1 (555) 234-5678" className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>Job Title</Label>
                                                <Input defaultValue="Marketing Director" className="mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                            Save Changes
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="company">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Company Details</h3>
                                    <div className="grid gap-6">
                                        <div>
                                            <Label>Company Name</Label>
                                            <Input defaultValue={user.companyName || 'Acme Corporation'} className="mt-1" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Industry</Label>
                                                <Select defaultValue="technology">
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="technology">Technology</SelectItem>
                                                        <SelectItem value="finance">Finance</SelectItem>
                                                        <SelectItem value="healthcare">Healthcare</SelectItem>
                                                        <SelectItem value="retail">Retail</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Company Size</Label>
                                                <Select defaultValue="51-200">
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1-10">1-10</SelectItem>
                                                        <SelectItem value="11-50">11-50</SelectItem>
                                                        <SelectItem value="51-200">51-200</SelectItem>
                                                        <SelectItem value="201-500">201-500</SelectItem>
                                                        <SelectItem value="500+">500+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Website</Label>
                                            <div className="relative mt-1">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <Input defaultValue="https://acmecorp.com" className="pl-10" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Company Description</Label>
                                            <Textarea 
                                                defaultValue="Leading technology company focused on innovation..."
                                                className="mt-1 min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                            Save Changes
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="preferences">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Sponsorship Preferences</h3>
                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <Label>Preferred Event Categories</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {['Tech', 'Conference', 'Workshop', 'Hackathon'].map(cat => (
                                                    <Button key={cat} variant="outline" size="sm" className="rounded-full">
                                                        {cat}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Sponsorship Budget Range</Label>
                                            <Select defaultValue="10000-25000">
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                                                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                                                    <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                                                    <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                                                    <SelectItem value="50000+">$50,000+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Notifications</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'New event recommendations', desc: 'Get notified about events matching your preferences' },
                                            { label: 'Application updates', desc: 'Updates on your sponsorship applications' },
                                            { label: 'Weekly digest', desc: 'Summary of top sponsorship opportunities' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-[#1F2937]">{item.label}</p>
                                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                                </div>
                                                <Switch defaultChecked={i < 2} />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Change Password</h3>
                                    <div className="grid gap-6 max-w-md">
                                        <div>
                                            <Label>Current Password</Label>
                                            <Input type="password" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>New Password</Label>
                                            <Input type="password" className="mt-1" />
                                        </div>
                                        <div>
                                            <Label>Confirm New Password</Label>
                                            <Input type="password" className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t flex justify-end">
                                        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                                            Update Password
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}
