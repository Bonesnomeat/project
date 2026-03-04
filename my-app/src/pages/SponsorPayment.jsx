import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    LayoutDashboard, Search, Calendar, History, Settings,
    CreditCard, Building2, Smartphone, CheckCircle,
    Upload, ArrowRight, ArrowLeft, User, ChevronDown, X, FileImage
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import Sidebar from '../components/shared/Sidebar';
import DashboardHeader from '../components/shared/DashboardHeader';
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";

const APPLICATIONS_KEY     = 'sponza_applications';
const PAYMENT_DETAILS_KEY  = 'sponza_college_payment_details';

function loadApplications() {
    try { const r = localStorage.getItem(APPLICATIONS_KEY); if (r) return JSON.parse(r); } catch {}
    return [];
}

function saveApplications(apps) {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
}

function loadCollegePaymentDetails() {
    try { const r = localStorage.getItem(PAYMENT_DETAILS_KEY); if (r) return JSON.parse(r); } catch {}
    return null;
}

// ── Step indicator ──
function StepBar({ step }) {
    const steps = ['Payment Mode', 'Review & Pay', 'Upload Proof'];
    return (
        <div className="flex items-center gap-0 mb-10">
            {steps.map((label, i) => {
                const num  = i + 1;
                const done = step > num;
                const active = step === num;
                return (
                    <React.Fragment key={label}>
                        <div className="flex flex-col items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                done   ? 'bg-[#22C55E] border-[#22C55E] text-white' :
                                active ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white' :
                                         'bg-white border-slate-300 text-slate-400'
                            }`}>
                                {done ? <CheckCircle className="w-4 h-4" /> : num}
                            </div>
                            <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${active ? 'text-[#1E3A8A]' : done ? 'text-[#22C55E]' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-5 ${step > num ? 'bg-[#22C55E]' : 'bg-slate-200'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default function SponsorPayment() {
    const navigate      = useNavigate();
    const [searchParams] = useSearchParams();
    const appId          = Number(searchParams.get('id'));

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [user,       setUser]       = useState(null);
    const [application,setApplication]= useState(null);
    const [collegeDetails, setCollegeDetails] = useState(null);
    const [step,       setStep]       = useState(1);

    // ── Step 1 state ──
    const [paymentMode,   setPaymentMode]   = useState(''); // 'upi' | 'bank'
    const [paymentType,   setPaymentType]   = useState(''); // 'full' | 'installment'
    // Each installment: { id, amount, date, note }
    const [installments, setInstallments] = useState([
        { id: 1, amount: '', date: '', note: '' },
        { id: 2, amount: '', date: '', note: '' },
    ]);
    const [payerName,     setPayerName]     = useState('');
    const [errors,        setErrors]        = useState({});

    // ── Step 3 state ──
    const [proofFile,    setProofFile]    = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [txnId,        setTxnId]        = useState('');
    const [submitted,    setSubmitted]    = useState(false);
    const fileRef = useRef(null);

    useEffect(() => {
        const auth = localStorage.getItem('sponza_auth');
        if (!auth) { navigate(createPageUrl('SignIn')); return; }
        const parsed = JSON.parse(auth);
        if (parsed.role !== 'sponsor') { navigate(createPageUrl('Home')); return; }
        setUser(parsed);
        setPayerName(parsed.name || '');

        // Load application
        const apps = loadApplications();
        const app  = apps.find(a => a.id === appId);
        if (!app) { navigate(createPageUrl('SponsorApplications')); return; }
        setApplication(app);

        // Load college payment details (keyed by collegeId if multiple colleges exist)
        const details = loadCollegePaymentDetails();
        setCollegeDetails(details);
    }, [navigate, appId]);

    const handleLogout = () => {
        localStorage.removeItem('sponza_auth');
        navigate(createPageUrl('Home'));
    };

    const sidebarItems = [
        { label: 'Dashboard',          icon: LayoutDashboard, page: 'SponsorDashboard' },
        { label: 'Browse Events',       icon: Search,          page: 'SponsorBrowseEvents' },
        { label: 'My Applications',     icon: Calendar,        page: 'SponsorApplications' },
        { label: 'Sponsorship History', icon: History,         page: 'SponsorHistory' },
        { label: 'Profile Settings',    icon: Settings,        page: 'SponsorSettings' },
    ];

    // Calculate amount for this payment
    const totalAmount     = application?.amount || 0;
    const installmentCount = paymentType === 'installment' ? installments.length : 1;
    // First installment amount (what they pay now), fallback to equal split
    const firstInstallment = installments[0]?.amount ? Number(installments[0].amount) : 0;
    const totalEntered     = installments.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const payableNow       = paymentType === 'full' ? totalAmount : firstInstallment;

    // ── Step 1 validation ──
    const validateStep1 = () => {
        const e = {};
        if (!paymentMode) e.paymentMode = 'Please select a payment mode';
        if (!paymentType) e.paymentType = 'Please select full or installment payment';
        if (!payerName.trim()) e.payerName = 'Name is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        setStep(s => s + 1);
        window.scrollTo(0, 0);
    };

    // ── File handler ──
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProofFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setProofPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    // ── Final submit ──
    const handleSubmit = () => {
        if (!proofFile && !txnId) {
            setErrors({ proof: 'Please upload a screenshot/statement or enter transaction ID' });
            return;
        }

        // Update application payment status in localStorage
        const apps   = loadApplications();
        const updated = apps.map(a =>
            a.id === appId
                ? {
                    ...a,
                    paymentStatus: 'submitted',
                    paymentDetails: {
                        mode:        paymentMode,
                        type:        paymentType,
                        installments: installmentCount,
                        payableNow,
                        payerName,
                        txnId,
                        proofFile:   proofPreview, // base64 for demo
                        submittedAt: new Date().toISOString(),
                    }
                }
                : a
        );
        saveApplications(updated);
        setSubmitted(true);
    };

    if (!user || !application) return null;

    // ────────────────────────────────────────────────
    //  SUCCESS SCREEN
    // ────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex">
                <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="sponsor" />
                <div className="flex-1 flex flex-col min-h-screen">
                    <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="SponsorSettings" />
                    <main className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Payment Submitted!</h2>
                            <p className="text-slate-500 mb-2">Your payment proof has been submitted to <span className="font-semibold text-[#1F2937]">{application.college}</span>.</p>
                            <p className="text-slate-400 text-sm mb-8">They will verify and confirm your payment within 1–2 business days.</p>
                            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 w-full" onClick={() => navigate(createPageUrl('SponsorApplications'))}>
                                Back to My Applications
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <Sidebar items={sidebarItems} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} userRole="sponsor" />

            <div className="flex-1 flex flex-col min-h-screen">
                <DashboardHeader user={user} onLogout={handleLogout} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} settingsPage="SponsorSettings" />

                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <div className="max-w-2xl mx-auto">

                        {/* Header */}
                        <div className="mb-8">
                            <button onClick={() => navigate(createPageUrl('SponsorApplications'))} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1E3A8A] mb-3 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Applications
                            </button>
                            <h1 className="text-3xl font-bold text-[#1F2937]">Make Payment</h1>
                            <p className="text-slate-500 mt-1">{application.eventTitle} — {application.college}</p>
                        </div>

                        <StepBar step={step} />

                        {/* ══════════════════════════════
                            STEP 1 — Payment Mode
                        ══════════════════════════════ */}
                        {step === 1 && (
                            <div className="space-y-6">

                                {/* Amount summary */}
                                <Card className="p-5 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/80 text-white">
                                    <p className="text-blue-100 text-sm mb-1">Total Sponsorship Amount</p>
                                    <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
                                    <p className="text-blue-200 text-sm mt-1">{application.package} Package • {application.eventTitle}</p>
                                </Card>

                                {/* Payment Mode */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Payment Mode
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: 'upi',  label: 'UPI',           icon: Smartphone, desc: 'PhonePe, GPay, Paytm' },
                                            { value: 'bank', label: 'Bank Transfer', icon: Building2,  desc: 'NEFT / RTGS / IMPS' },
                                        ].map(({ value, label, icon: Icon, desc }) => (
                                            <button
                                                key={value}
                                                onClick={() => { setPaymentMode(value); setErrors(e => ({ ...e, paymentMode: '' })); }}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                    paymentMode === value
                                                        ? 'border-[#1E3A8A] bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <Icon className={`w-6 h-6 mb-2 ${paymentMode === value ? 'text-[#1E3A8A]' : 'text-slate-400'}`} />
                                                <p className={`font-semibold text-sm ${paymentMode === value ? 'text-[#1E3A8A]' : 'text-slate-700'}`}>{label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.paymentMode && <p className="text-xs text-red-500 mt-2">{errors.paymentMode}</p>}
                                </Card>

                                {/* Payment Type */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-[#1F2937] mb-4">Payment Schedule</h3>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {[
                                            { value: 'full',        label: 'Full Payment',  desc: 'Pay entire amount at once' },
                                            { value: 'installment', label: 'Installments',  desc: 'Split into multiple payments' },
                                        ].map(({ value, label, desc }) => (
                                            <button
                                                key={value}
                                                onClick={() => { setPaymentType(value); setErrors(e => ({ ...e, paymentType: '' })); }}
                                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                                    paymentType === value
                                                        ? 'border-[#1E3A8A] bg-blue-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                            >
                                                <p className={`font-semibold text-sm ${paymentType === value ? 'text-[#1E3A8A]' : 'text-slate-700'}`}>{label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.paymentType && <p className="text-xs text-red-500 mt-1">{errors.paymentType}</p>}

                                    {/* ✅ Custom installment builder */}
                                    {paymentType === 'installment' && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-slate-700">Custom Installment Plan</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                                        totalEntered === totalAmount ? 'bg-green-100 text-green-700' :
                                                        totalEntered > totalAmount  ? 'bg-red-100 text-red-600' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                        ₹{totalEntered.toLocaleString()} / ₹{totalAmount.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Installment rows */}
                                            {installments.map((inst, idx) => (
                                                <div key={inst.id} className="bg-white rounded-xl p-4 border border-slate-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wide">
                                                            Installment {idx + 1}
                                                        </span>
                                                        {installments.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setInstallments(prev => prev.filter(i => i.id !== inst.id))}
                                                                className="text-red-400 hover:text-red-600 text-xs font-medium"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs text-slate-500 mb-1 block">Amount (₹)</label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                placeholder="e.g. 5000"
                                                                value={inst.amount}
                                                                onChange={e => setInstallments(prev =>
                                                                    prev.map(i => i.id === inst.id ? { ...i, amount: e.target.value } : i)
                                                                )}
                                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-slate-500 mb-1 block">Payment Date</label>
                                                            <input
                                                                type="date"
                                                                value={inst.date}
                                                                min={new Date().toISOString().split('T')[0]}
                                                                onChange={e => setInstallments(prev =>
                                                                    prev.map(i => i.id === inst.id ? { ...i, date: e.target.value } : i)
                                                                )}
                                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <label className="text-xs text-slate-500 mb-1 block">Note <span className="text-slate-400">(optional)</span></label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. First payment, advance, etc."
                                                                value={inst.note}
                                                                onChange={e => setInstallments(prev =>
                                                                    prev.map(i => i.id === inst.id ? { ...i, note: e.target.value } : i)
                                                                )}
                                                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add installment button */}
                                            <button
                                                type="button"
                                                onClick={() => setInstallments(prev => [
                                                    ...prev,
                                                    { id: Date.now(), amount: '', date: '', note: '' }
                                                ])}
                                                className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-500 hover:border-[#1E3A8A] hover:text-[#1E3A8A] transition-colors font-medium"
                                            >
                                                + Add Another Installment
                                            </button>

                                            {/* Remaining balance hint */}
                                            {totalEntered > 0 && totalEntered !== totalAmount && (
                                                <p className={`text-xs font-medium ${totalEntered > totalAmount ? 'text-red-500' : 'text-orange-500'}`}>
                                                    {totalEntered > totalAmount
                                                        ? `⚠ Total exceeds amount by ₹${(totalEntered - totalAmount).toLocaleString()}`
                                                        : `Remaining: ₹${(totalAmount - totalEntered).toLocaleString()} unallocated`
                                                    }
                                                </p>
                                            )}
                                            {totalEntered === totalAmount && totalEntered > 0 && (
                                                <p className="text-xs text-green-600 font-medium">✓ Full amount allocated across {installments.length} installments</p>
                                            )}
                                        </div>
                                    )}
                                </Card>

                                {/* Payer Name */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Payer Details
                                    </h3>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name of Person Making Payment</label>
                                        <Input
                                            placeholder="Enter your full name"
                                            value={payerName}
                                            onChange={e => { setPayerName(e.target.value); setErrors(err => ({ ...err, payerName: '' })); }}
                                            className={errors.payerName ? 'border-red-400' : ''}
                                        />
                                        {errors.payerName && <p className="text-xs text-red-500 mt-1">{errors.payerName}</p>}
                                    </div>
                                </Card>

                                <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12" onClick={handleNext}>
                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* ══════════════════════════════
                            STEP 2 — Review & Pay
                        ══════════════════════════════ */}
                        {step === 2 && (
                            <div className="space-y-6">

                                {/* Order summary */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-[#1F2937] mb-4">Payment Summary</h3>
                                    <div className="space-y-3 text-sm">
                                        {[
                                            { label: 'Event',        value: application.eventTitle },
                                            { label: 'College',      value: application.college },
                                            { label: 'Package',      value: application.package },
                                            { label: 'Total Amount', value: `₹${totalAmount.toLocaleString()}` },
                                            { label: 'Payment Mode', value: paymentMode === 'upi' ? 'UPI' : 'Bank Transfer' },
                                            { label: 'Payment Type', value: paymentType === 'full' ? 'Full Payment' : `Installments (${installmentCount} payments)` },
                                            { label: 'Paying Now',   value: `₹${payableNow.toLocaleString()}`, highlight: true },
                                            { label: 'Payer Name',   value: payerName },
                                        ].map(({ label, value, highlight }) => (
                                            <div key={label} className={`flex justify-between ${highlight ? 'pt-3 border-t font-bold text-base' : ''}`}>
                                                <span className="text-slate-500">{label}</span>
                                                <span className={highlight ? 'text-[#22C55E]' : 'text-[#1F2937] font-medium'}>{value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* ✅ Pay-to details right inside summary */}
                                    {collegeDetails && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                                                {paymentMode === 'upi' ? '📱 Pay To (UPI)' : '🏦 Pay To (Bank)'}
                                            </p>

                                            {paymentMode === 'upi' && collegeDetails.upi?.upiId && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                                                        <div>
                                                            <p className="text-xs text-purple-500 font-medium">UPI ID</p>
                                                            <p className="font-bold text-[#1F2937] font-mono text-base mt-0.5">{collegeDetails.upi.upiId}</p>
                                                        </div>
                                                        <Smartphone className="w-6 h-6 text-purple-400" />
                                                    </div>
                                                    <div className="flex justify-between text-sm px-1">
                                                        <span className="text-slate-400">Account Name</span>
                                                        <span className="font-medium text-[#1F2937]">{collegeDetails.upi.upiName}</span>
                                                    </div>
                                                    {collegeDetails.upi.upiApp && (
                                                        <div className="flex justify-between text-sm px-1">
                                                            <span className="text-slate-400">Preferred App</span>
                                                            <span className="font-medium text-[#1F2937]">{collegeDetails.upi.upiApp}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {paymentMode === 'bank' && collegeDetails.bank?.accountNumber && (
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Account Holder', value: collegeDetails.bank.accountHolder },
                                                        { label: 'Account Number', value: collegeDetails.bank.accountNumber, mono: true },
                                                        { label: 'IFSC Code',      value: collegeDetails.bank.ifscCode,      mono: true },
                                                        { label: 'Bank Name',      value: collegeDetails.bank.bankName },
                                                        { label: 'Branch',         value: collegeDetails.bank.branchName },
                                                        { label: 'Account Type',   value: collegeDetails.bank.accountType?.charAt(0).toUpperCase() + collegeDetails.bank.accountType?.slice(1) },
                                                    ].filter(f => f.value).map(({ label, value, mono }) => (
                                                        <div key={label} className="flex justify-between text-sm px-1">
                                                            <span className="text-slate-400">{label}</span>
                                                            <span className={`font-medium text-[#1F2937] ${mono ? 'font-mono' : ''}`}>{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {paymentMode === 'upi' && !collegeDetails.upi?.upiId && (
                                                <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">UPI details not added by college yet.</p>
                                            )}
                                            {paymentMode === 'bank' && !collegeDetails.bank?.accountNumber && (
                                                <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">Bank details not added by college yet.</p>
                                            )}
                                        </div>
                                    )}

                                    {!collegeDetails && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                                                College hasn't added payment details yet. Contact them directly.
                                            </p>
                                        </div>
                                    )}
                                </Card>

                                                                {/* Payment Done button */}
                                <Card className="p-6 border-2 border-[#22C55E]/30 bg-green-50">
                                    <p className="text-sm text-slate-600 mb-4">
                                        Once you've completed the transfer, click the button below to upload your payment proof.
                                    </p>
                                    <Button className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white h-12 text-base font-semibold" onClick={handleNext}>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Payment Done — Upload Proof
                                    </Button>
                                </Card>

                                <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            </div>
                        )}

                        {/* ══════════════════════════════
                            STEP 3 — Upload Proof
                        ══════════════════════════════ */}
                        {step === 3 && (
                            <div className="space-y-6">

                                <Card className="p-6">
                                    <h3 className="font-semibold text-[#1F2937] mb-1">Upload Payment Proof</h3>
                                    <p className="text-sm text-slate-500 mb-6">Upload a screenshot or bank statement of the transaction</p>

                                    {/* File drop zone */}
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                                            proofFile ? 'border-[#22C55E] bg-green-50' : 'border-slate-300 hover:border-[#1E3A8A] hover:bg-blue-50'
                                        }`}
                                    >
                                        {proofPreview ? (
                                            <div className="relative inline-block">
                                                <img src={proofPreview} alt="Proof" className="max-h-48 rounded-lg mx-auto object-contain" />
                                                <button
                                                    onClick={e => { e.stopPropagation(); setProofFile(null); setProofPreview(null); }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <FileImage className="w-7 h-7 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-700">Click to upload screenshot / bank statement</p>
                                                <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF — max 10MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    {proofFile && (
                                        <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <p className="text-sm text-green-700 font-medium truncate">{proofFile.name}</p>
                                        </div>
                                    )}
                                </Card>

                                {/* Transaction ID */}
                                <Card className="p-6">
                                    <h3 className="font-semibold text-[#1F2937] mb-1">Transaction ID <span className="text-slate-400 font-normal text-sm">(optional)</span></h3>
                                    <p className="text-sm text-slate-500 mb-4">Enter the UPI reference number or bank transaction ID</p>
                                    <Input
                                        placeholder="e.g. 123456789012 or T2402151234567890"
                                        value={txnId}
                                        onChange={e => { setTxnId(e.target.value); setErrors({}); }}
                                    />
                                    {errors.proof && <p className="text-xs text-red-500 mt-2">{errors.proof}</p>}
                                </Card>

                                {/* Submit */}
                                <Button
                                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 h-12 text-base font-semibold"
                                    onClick={handleSubmit}
                                >
                                    <Upload className="w-5 h-5 mr-2" />
                                    Submit Payment Proof
                                </Button>

                                <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}