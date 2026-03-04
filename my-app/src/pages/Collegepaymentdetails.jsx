import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, PlusCircle, Calendar, FileText,
    CreditCard, Settings, Save, CheckCircle,
    Building2, Smartphone, Info
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";

const PAYMENT_DETAILS_KEY = 'sponza_college_payment_details';

export default function CollegePaymentDetails() {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [saved, setSaved] = useState(false);

    // ── UPI form ──
    const [upiForm, setUpiForm] = useState({
        upiId: '',
        upiName: '',
        upiApp: '',
    });

    // ── Bank Transfer form ──
    const [bankForm, setBankForm] = useState({
        accountHolder: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        bankName: '',
        branchName: '',
        accountType: 'savings',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'college') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);

        // Load saved payment details
        try {
            const raw = localStorage.getItem(PAYMENT_DETAILS_KEY);
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved.upi)  setUpiForm(saved.upi);
                if (saved.bank) setBankForm(saved.bank);
            }
        } catch {}
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const validate = () => {
        const e = {};
        // UPI validation
        if (upiForm.upiId && !upiForm.upiId.includes('@'))
            e.upiId = 'Enter a valid UPI ID (e.g. name@bank)';
        if (upiForm.upiId && !upiForm.upiName)
            e.upiName = 'Account name is required';

        // Bank validation
        if (bankForm.accountNumber && bankForm.accountNumber !== bankForm.confirmAccountNumber)
            e.confirmAccountNumber = 'Account numbers do not match';
        if (bankForm.accountNumber && !/^\d{9,18}$/.test(bankForm.accountNumber))
            e.accountNumber = 'Enter a valid account number (9–18 digits)';
        if (bankForm.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifscCode.toUpperCase()))
            e.ifscCode = 'Enter a valid IFSC code (e.g. SBIN0001234)';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;

        const details = {
            upi:  upiForm,
            bank: { ...bankForm, ifscCode: bankForm.ifscCode.toUpperCase() },
            collegeName: user?.collegeName || user?.name || '',
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(PAYMENT_DETAILS_KEY, JSON.stringify(details));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const sidebarItems = [
        { label: 'Dashboard',           icon: LayoutDashboard, page: 'CollegeDashboard' },
        { label: 'Create Event',         icon: PlusCircle,      page: 'CollegeCreateEvent' },
        { label: 'Manage Events',        icon: Calendar,        page: 'CollegeManageEvents' },
        { label: 'Sponsorship Requests', icon: FileText,        page: 'CollegeSponsorshipRequests' },
        { label: 'Payment Records',      icon: CreditCard,      page: 'CollegePayments' },
        { label: 'Profile Settings',     icon: Settings,        page: 'CollegeSettings' },
    ];

    const Field = ({ label, error, children }) => (
        <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="college" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="CollegeSettings" />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-3xl mx-auto">

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1F2937]">Payment Details</h1>
                            <p className="text-slate-600 mt-1">Add your UPI and bank details so sponsors can make payments</p>
                        </div>

                        {/* Info banner */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-8">
                            <Info className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-[#1E3A8A]">
                                These details will be shown to sponsors when their application is approved.
                                Fill at least one payment method (UPI or Bank Transfer).
                            </p>
                        </div>

                        {/* ── UPI Section ── */}
                        <Card className="p-6 mb-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Smartphone className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1F2937]">UPI Details</h2>
                                    <p className="text-sm text-slate-500">For instant transfers via PhonePe, GPay, Paytm etc.</p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <Field label="UPI ID" error={errors.upiId}>
                                    <Input
                                        placeholder="e.g. college@okicici"
                                        value={upiForm.upiId}
                                        onChange={e => setUpiForm(p => ({ ...p, upiId: e.target.value }))}
                                        className={errors.upiId ? 'border-red-400' : ''}
                                    />
                                </Field>

                                <Field label="Account Holder Name" error={errors.upiName}>
                                    <Input
                                        placeholder="Name as registered with UPI"
                                        value={upiForm.upiName}
                                        onChange={e => setUpiForm(p => ({ ...p, upiName: e.target.value }))}
                                        className={errors.upiName ? 'border-red-400' : ''}
                                    />
                                </Field>

                                <Field label="Preferred UPI App (optional)">
                                    <div className="flex gap-2 flex-wrap">
                                        {['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Other'].map(app => (
                                            <button
                                                key={app}
                                                type="button"
                                                onClick={() => setUpiForm(p => ({ ...p, upiApp: p.upiApp === app ? '' : app }))}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                                                    upiForm.upiApp === app
                                                        ? 'bg-purple-600 text-white border-purple-600'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-400'
                                                }`}
                                            >
                                                {app}
                                            </button>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        </Card>

                        {/* ── Bank Transfer Section ── */}
                        <Card className="p-6 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1F2937]">Bank Transfer Details</h2>
                                    <p className="text-sm text-slate-500">For NEFT / RTGS / IMPS transfers</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Field label="Account Holder Name">
                                        <Input
                                            placeholder="Full name as on bank account"
                                            value={bankForm.accountHolder}
                                            onChange={e => setBankForm(p => ({ ...p, accountHolder: e.target.value }))}
                                        />
                                    </Field>
                                </div>

                                <Field label="Account Number" error={errors.accountNumber}>
                                    <Input
                                        placeholder="Enter account number"
                                        value={bankForm.accountNumber}
                                        onChange={e => setBankForm(p => ({ ...p, accountNumber: e.target.value }))}
                                        className={errors.accountNumber ? 'border-red-400' : ''}
                                    />
                                </Field>

                                <Field label="Confirm Account Number" error={errors.confirmAccountNumber}>
                                    <Input
                                        placeholder="Re-enter account number"
                                        value={bankForm.confirmAccountNumber}
                                        onChange={e => setBankForm(p => ({ ...p, confirmAccountNumber: e.target.value }))}
                                        className={errors.confirmAccountNumber ? 'border-red-400' : ''}
                                    />
                                </Field>

                                <Field label="IFSC Code" error={errors.ifscCode}>
                                    <Input
                                        placeholder="e.g. SBIN0001234"
                                        value={bankForm.ifscCode}
                                        onChange={e => setBankForm(p => ({ ...p, ifscCode: e.target.value.toUpperCase() }))}
                                        className={errors.ifscCode ? 'border-red-400' : ''}
                                    />
                                </Field>

                                <Field label="Bank Name">
                                    <Input
                                        placeholder="e.g. State Bank of India"
                                        value={bankForm.bankName}
                                        onChange={e => setBankForm(p => ({ ...p, bankName: e.target.value }))}
                                    />
                                </Field>

                                <Field label="Branch Name">
                                    <Input
                                        placeholder="e.g. Koramangala Branch"
                                        value={bankForm.branchName}
                                        onChange={e => setBankForm(p => ({ ...p, branchName: e.target.value }))}
                                    />
                                </Field>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Account Type</label>
                                    <div className="flex gap-3">
                                        {['savings', 'current'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setBankForm(p => ({ ...p, accountType: type }))}
                                                className={`px-4 py-2 rounded-lg text-sm border capitalize transition-colors ${
                                                    bankForm.accountType === type
                                                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#1E3A8A]'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSave}
                                className={`px-8 ${saved ? 'bg-green-500 hover:bg-green-500' : 'bg-[#1E3A8A] hover:bg-[#1E3A8A]/90'}`}
                            >
                                {saved
                                    ? <><CheckCircle className="w-4 h-4 mr-2" />Saved!</>
                                    : <><Save className="w-4 h-4 mr-2" />Save Payment Details</>
                                }
                            </Button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}