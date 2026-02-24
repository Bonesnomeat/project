import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Search, MoreVertical,
    Eye, CheckCircle, Trash2
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Badge } from "C:/Users/USER/sponza/project/my-app/src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "C:/Users/USER/sponza/project/my-app/src/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "C:/Users/USER/sponza/project/my-app/src/components/ui/dropdown-menu";
import { dummyEvents } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function AdminEvents() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

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

    const filteredEvents = dummyEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

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
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Manage Events</h1>
                            <p className="text-slate-600 mt-1">Review and manage all platform events</p>
                        </div>

                        <Card className="mb-6">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Tech">Tech</SelectItem>
                                        <SelectItem value="Cultural">Cultural</SelectItem>
                                        <SelectItem value="Sports">Sports</SelectItem>
                                        <SelectItem value="Workshop">Workshop</SelectItem>
                                        <SelectItem value="Conference">Conference</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <Card>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Event</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Sponsorship Range</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-[#1F2937]">{event.title}</p>
                                                            <p className="text-sm text-slate-500">{event.expectedAttendees.toLocaleString()} attendees</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{event.college}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{event.category}</Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{event.date}</TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-[#22C55E]">
                                                        ${event.minSponsorship.toLocaleString()} - ${event.maxSponsorship.toLocaleString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-green-100 text-green-700">
                                                        {event.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}