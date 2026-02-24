import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Search, MoreVertical,
    GraduationCap, Building2, Shield, Ban, CheckCircle
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
import { allUsers } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

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

    const filteredUsers = allUsers.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const roleIcons = {
        college: <GraduationCap className="w-4 h-4 text-blue-600" />,
        sponsor: <Building2 className="w-4 h-4 text-green-600" />,
        admin: <Shield className="w-4 h-4 text-purple-600" />,
    };

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
                            <h1 className="text-3xl font-bold text-[#1F2937]">Manage Users</h1>
                            <p className="text-slate-600 mt-1">View and manage all platform users</p>
                        </div>

                        <Card className="mb-6">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="college">College</SelectItem>
                                        <SelectItem value="sponsor">Sponsor</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <Card>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Join Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.map((u) => (
                                            <TableRow key={u.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                            u.role === 'college' ? 'bg-blue-100' : 'bg-green-100'
                                                        }`}>
                                                            {roleIcons[u.role]}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[#1F2937]">{u.name}</p>
                                                            <p className="text-sm text-slate-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{u.role}</Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{u.joinDate}</TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        u.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        u.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }>
                                                        {u.status}
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
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Ban className="w-4 h-4 mr-2" />
                                                                Suspend
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