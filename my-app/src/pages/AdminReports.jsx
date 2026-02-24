import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Download, TrendingUp, DollarSign, Target
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { dummyAdminStats } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AdminReports() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [timeRange, setTimeRange] = useState('6months');

    useEffect(() => {
        // ✅ Check sessionStorage for admin unlock
        const adminUnlocked = sessionStorage.getItem('admin_unlocked') === 'true';
        if (!adminUnlocked) {
            navigate(createPageUrl('AdminPanel'));
            return;
        }
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            const parsed = JSON.parse(auth);
            setUser(parsed);
        } else {
            setUser({
                id: 'admin-1',
                name: 'Admin',
                email: 'admin@sponza.com',
                role: 'admin',
            });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        sessionStorage.removeItem('admin_unlocked'); // ✅ Clear session on logout
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users', icon: Users, page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar, page: 'AdminEvents' },
        { label: 'Sponsorships', icon: FileText, page: 'AdminSponsorships' },
        { label: 'Reports', icon: BarChart3, page: 'AdminReports' },
    ];

    const revenueData = [
        { month: 'Jan', revenue: 125000, events: 12 },
        { month: 'Feb', revenue: 180000, events: 18 },
        { month: 'Mar', revenue: 220000, events: 22 },
        { month: 'Apr', revenue: 280000, events: 28 },
        { month: 'May', revenue: 350000, events: 35 },
        { month: 'Jun', revenue: 420000, events: 42 },
    ];

    const categoryData = [
        { name: 'Tech', value: 45, color: '#1E3A8A' },
        { name: 'Cultural', value: 20, color: '#22C55E' },
        { name: 'Sports', value: 15, color: '#F97316' },
        { name: 'Workshop', value: 12, color: '#8B5CF6' },
        { name: 'Conference', value: 8, color: '#EC4899' },
    ];

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar 
                items={sidebarItems} 
                collapsed={sidebarCollapsed} 
                setCollapsed={setSidebarCollapsed}
                userRole="admin"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader 
                    user={user}
                    onLogout={handleLogout}
                    onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    settingsPage="AdminPanel"
                />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1F2937]">Reports & Analytics</h1>
                                <p className="text-slate-600 mt-1">Platform performance insights</p>
                            </div>
                            <div className="flex gap-3">
                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30days">Last 30 Days</SelectItem>
                                        <SelectItem value="3months">Last 3 Months</SelectItem>
                                        <SelectItem value="6months">Last 6 Months</SelectItem>
                                        <SelectItem value="1year">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Report
                                </Button>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid md:grid-cols-4 gap-6 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Total Sponser Raised</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">$2.5M</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+32% from last period</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Avg. Sponsorship</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">$18.5K</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Target className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+12% from last period</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Success Rate</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">87%</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+5% from last period</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Active Users</p>
                                        <p className="text-2xl font-bold text-[#1F2937] mt-1">1,250</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="flex items-center mt-3 text-green-600">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">+18% from last period</span>
                                </div>
                            </Card>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-8">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">User Trend</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                            <XAxis dataKey="month" stroke="#64748B" />
                                            <YAxis stroke="#64748B" tickFormatter={(v) => `$${v/1000}K`} />
                                            <Tooltip 
                                                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="revenue" 
                                                stroke="#1E3A8A" 
                                                fill="url(#colorRevenue)" 
                                                strokeWidth={2}
                                            />
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-[#1F2937] mb-6">Events by Category</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => [`${value}%`, 'Share']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                    {categoryData.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-sm text-slate-600">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-[#1F2937] mb-6">Events Created per Month</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                        <XAxis dataKey="month" stroke="#64748B" />
                                        <YAxis stroke="#64748B" />
                                        <Tooltip 
                                            formatter={(value) => [value, 'Events']}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="events" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}