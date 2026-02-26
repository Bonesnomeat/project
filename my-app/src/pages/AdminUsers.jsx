import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, Users, Calendar, FileText, 
    BarChart3, Search, MoreVertical,
    GraduationCap, Building2, Shield, Ban, CheckCircle,
    X, Mail, Phone, MapPin, Globe, User, Briefcase
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

// ✅ Detail Modal Component
function UserDetailModal({ user: selectedUser, onClose }) {
    if (!selectedUser) return null;

    const isCollege = selectedUser.role === 'college';
    const isSponsor = selectedUser.role === 'sponsor';

    // ✅ Read full user data from localStorage if it matches
    const auth = localStorage.getItem('sponza_auth');
    const liveData = auth ? JSON.parse(auth) : null;
    const data = (liveData && liveData.email === selectedUser.email) ? liveData : selectedUser;

    const InfoRow = ({ icon, label, value }) => {
        if (!value) return null;
        return (
            <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-[#1F2937] font-medium mt-0.5">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                    {/* Header */}
                    <div className={`p-6 rounded-t-2xl ${
                        isCollege ? 'bg-blue-50' : isSponsor ? 'bg-green-50' : 'bg-purple-50'
                    }`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                                    isCollege ? 'bg-blue-100 text-blue-600' :
                                    isSponsor ? 'bg-green-100 text-green-600' :
                                    'bg-purple-100 text-purple-600'
                                }`}>
                                    {data.avatar
                                        ? <img src={data.avatar} alt={data.name} className="w-full h-full object-cover rounded-2xl" />
                                        : data.name?.charAt(0).toUpperCase()
                                    }
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#1F2937]">{data.name}</h2>
                                    <p className="text-slate-500 text-sm">{data.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={
                                            isCollege ? 'bg-blue-100 text-blue-700' :
                                            isSponsor ? 'bg-green-100 text-green-700' :
                                            'bg-purple-100 text-purple-700'
                                        }>
                                            {selectedUser.role}
                                        </Badge>
                                        <Badge className={
                                            selectedUser.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }>
                                            {selectedUser.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">

                        {/* ── Basic Info ── */}
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                            Basic Information
                        </h3>
                        <div className="mb-6">
                            <InfoRow icon={<Mail className="w-4 h-4 text-slate-500" />}    label="Email"       value={data.email} />
                            <InfoRow icon={<Phone className="w-4 h-4 text-slate-500" />}   label="Phone"       value={data.phone} />
                            <InfoRow icon={<User className="w-4 h-4 text-slate-500" />}    label="Join Date"   value={selectedUser.joinDate} />
                            <InfoRow icon={<Shield className="w-4 h-4 text-slate-500" />}  label="Role"        value={selectedUser.role} />
                        </div>

                        {/* ── College-specific info ── */}
                        {isCollege && (
                            <>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                                    College Details
                                </h3>
                                <div className="mb-6">
                                    <InfoRow icon={<GraduationCap className="w-4 h-4 text-blue-500" />} label="College Name"  value={data.collegeName} />
                                    <InfoRow icon={<MapPin className="w-4 h-4 text-blue-500" />}        label="Location"     value={data.location} />
                                    <InfoRow icon={<Globe className="w-4 h-4 text-blue-500" />}         label="Website"      value={data.website} />
                                    <InfoRow icon={<User className="w-4 h-4 text-blue-500" />}          label="College Type" value={data.collegeType} />
                                    <InfoRow icon={<Shield className="w-4 h-4 text-blue-500" />}        label="AISHE Code"   value={data.aisheCode} />
                                </div>
                            </>
                        )}

                        {/* ── Sponsor-specific info ── */}
                        {isSponsor && (
                            <>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                                    Company Details
                                </h3>
                                <div className="mb-6">
                                    <InfoRow icon={<Building2 className="w-4 h-4 text-green-500" />}   label="Company Name"   value={data.companyName} />
                                    <InfoRow icon={<Briefcase className="w-4 h-4 text-green-500" />}   label="Industry"       value={data.industry} />
                                    <InfoRow icon={<Building2 className="w-4 h-4 text-green-500" />}   label="Company Type"   value={data.companyType} />
                                    <InfoRow icon={<Users className="w-4 h-4 text-green-500" />}       label="Company Size"   value={data.companySize} />
                                    <InfoRow icon={<Globe className="w-4 h-4 text-green-500" />}       label="Website"        value={data.companyWebsite || data.website} />
                                    <InfoRow icon={<MapPin className="w-4 h-4 text-green-500" />}      label="Address"        value={data.registeredAddress} />
                                    <InfoRow icon={<Shield className="w-4 h-4 text-green-500" />}      label="GST Number"     value={data.gstNumber} />
                                    <InfoRow icon={<User className="w-4 h-4 text-green-500" />}        label="Designation"    value={data.designation} />
                                    <InfoRow icon={<Mail className="w-4 h-4 text-green-500" />}        label="Official Email" value={data.officialEmail} />
                                    <InfoRow icon={<Phone className="w-4 h-4 text-green-500" />}       label="WhatsApp"       value={data.whatsapp} />
                                </div>

                                {/* Sponsor preferences */}
                                {(data.selectedCategories?.length > 0 || data.budgetRange) && (
                                    <>
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                                            Sponsorship Preferences
                                        </h3>
                                        <div className="mb-4">
                                            {data.budgetRange && (
                                                <div className="py-3 border-b border-slate-100">
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Budget Range</p>
                                                    <p className="text-sm font-medium text-[#1F2937]">{data.budgetRange}</p>
                                                </div>
                                            )}
                                            {data.selectedCategories?.length > 0 && (
                                                <div className="py-3 border-b border-slate-100">
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Preferred Categories</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {data.selectedCategories.map(cat => (
                                                            <span key={cat} className="px-2 py-0.5 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs">{cat}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {data.selectedStates?.length > 0 && (
                                                <div className="py-3">
                                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">Preferred States</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {data.selectedStates.map(state => (
                                                            <span key={state} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">{state}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* Footer */}
                        <div className="pt-4 border-t flex justify-end">
                            <Button variant="outline" onClick={onClose}>Close</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ── Main Component ──
export default function AdminUsers() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null); // ✅ for modal

    const [users, setUsers] = useState(
        allUsers.map(u => ({ ...u, status: u.status === 'suspended' ? 'suspended' : 'active' }))
    );

    useEffect(() => {
        const adminUnlocked = sessionStorage.getItem('admin_unlocked') === 'true';
        if (!adminUnlocked) { navigate(createPageUrl('AdminPanel')); return; }
        const auth = localStorage.getItem('sponza_auth');
        if (auth) {
            setUser(JSON.parse(auth));
        } else {
            setUser({ id: 'admin-1', name: 'Admin', email: 'admin@sponza.com', role: 'admin' });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        sessionStorage.removeItem('admin_unlocked');
        navigate(createPageUrl('Home'));
    };

    const handleToggleStatus = (userId) => {
        setUsers(prev =>
            prev.map(u =>
                u.id === userId
                    ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
                    : u
            )
        );
    };

    const sidebarItems = [
        { label: 'Dashboard',     icon: LayoutDashboard, page: 'AdminPanel' },
        { label: 'Manage Users',  icon: Users,           page: 'AdminUsers' },
        { label: 'Manage Events', icon: Calendar,        page: 'AdminEvents' },
        { label: 'Sponsorships',  icon: FileText,        page: 'AdminSponsorships' },
        { label: 'Reports',       icon: BarChart3,       page: 'AdminReports' },
    ];

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole   = roleFilter   === 'all' || u.role   === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const roleIcons = {
        college: <GraduationCap className="w-4 h-4 text-blue-600" />,
        sponsor: <Building2     className="w-4 h-4 text-green-600" />,
        admin:   <Shield        className="w-4 h-4 text-purple-600" />,
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="admin" />

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

                        {/* Search + Filters */}
                        <Card className="mb-6">
                            <div className="p-4 flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="college">College</SelectItem>
                                        <SelectItem value="sponsor">Sponsor</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <p className="text-sm text-slate-500 mb-4">
                            Showing <span className="font-semibold text-[#1F2937]">{filteredUsers.length}</span> of {users.length} users
                        </p>

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
                                        {filteredUsers.map(u => (
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
                                                        u.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
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

                                                            {/* ✅ View Details option */}
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => setSelectedUser(u)}
                                                            >
                                                                <User className="w-4 h-4 mr-2 text-slate-500" />
                                                                View Details
                                                            </DropdownMenuItem>

                                                            {/* ✅ Suspend / Unsuspend */}
                                                            {u.status === 'active' ? (
                                                                <DropdownMenuItem
                                                                    className="text-red-600 cursor-pointer"
                                                                    onClick={() => handleToggleStatus(u.id)}
                                                                >
                                                                    <Ban className="w-4 h-4 mr-2" />
                                                                    Suspend
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem
                                                                    className="text-green-600 cursor-pointer"
                                                                    onClick={() => handleToggleStatus(u.id)}
                                                                >
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Unsuspend
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                                                    No users found matching your filters
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>

            {/* ✅ User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </div>
    );
}