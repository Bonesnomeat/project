import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Calendar, PlusCircle, FileText, 
    CreditCard, Settings, User, Building2, Bell, Lock, Camera
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "C:/Users/USER/sponza/project/my-app/src/components/ui/avatar";

export default function CollegeSettings() {
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
                            <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
                            <p className="text-slate-600 mt-1">Manage your profile and preferences</p>
                        </div>

                        <Tabs defaultValue="profile">
                            <TabsList className="mb-6">
                                <TabsTrigger value="profile">
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="organization">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Organization
                                </TabsTrigger>
                                <TabsTrigger value="notifications">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notifications
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
                                                <Input defaultValue={user.phone || '+1 (555) 123-4567'} className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>Role</Label>
                                                <Input defaultValue="Event Coordinator" className="mt-1" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Bio</Label>
                                            <Textarea 
                                                placeholder="Tell sponsors about yourself..."
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

                            <TabsContent value="organization">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Organization Details</h3>
                                    <div className="grid gap-6">
                                        <div>
                                            <Label>College Name</Label>
                                            <Input defaultValue={user.collegeName || 'Tech University'} className="mt-1" />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <Label>Location</Label>
                                                <Input defaultValue={user.location || 'San Francisco, CA'} className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>AISHE CODE</Label>
                                                <Input defaultValue={user.aisheCode || '123456'} className="mt-1" />
                                            </div>
                                            <div>
                                                <Label>Website</Label>
                                                <Input defaultValue="https://techuniversity.edu" className="mt-1" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>About</Label>
                                            <Textarea 
                                                defaultValue="A leading institution in technology education..."
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

                            <TabsContent value="notifications">
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-[#1F2937] mb-6">Notification Preferences</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'New sponsorship requests', desc: 'Get notified when sponsors apply' },
                                            { label: 'Payment received', desc: 'Notifications for successful payments' },
                                            { label: 'Weekly reports', desc: 'Receive weekly performance summaries' },
                                            { label: 'Marketing updates', desc: 'News and tips from Sponza' },
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
