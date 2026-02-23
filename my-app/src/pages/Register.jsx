import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "C:/Users/USER/sponza/project/my-app/src/components/ui/button";
import { Input } from "C:/Users/USER/sponza/project/my-app/src/components/ui/input";
import { Label } from "C:/Users/USER/sponza/project/my-app/src/components/ui/label";
import { Card } from "C:/Users/USER/sponza/project/my-app/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "C:/Users/USER/sponza/project/my-app/src/components/ui/select";
import { Textarea } from "C:/Users/USER/sponza/project/my-app/src/components/ui/textarea";
import { 
    Sparkles, Mail, Lock, Eye, EyeOff, User, Building2, 
    GraduationCap, Phone, Globe, MapPin, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { createPageUrl } from 'C:/Users/USER/sponza/project/my-app/src/utils';
import { dummyUsers } from 'C:/Users/USER/sponza/project/my-app/src/components/data/dummyData';

export default function Register() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        collegeName: '',
        collegeType: '',
        location: '',
        website: '',
        companyName: '',
        industry: '',
        companySize: '',
        sponsorshipBudget: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!role) newErrors.role = 'Please select a role';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        
        if (role === 'college') {
            if (!formData.collegeName) newErrors.collegeName = 'College name is required';
            if (!formData.collegeType) newErrors.collegeType = 'College type is required';
            if (!formData.location) newErrors.location = 'Location is required';
        } else {
            if (!formData.companyName) newErrors.companyName = 'Company name is required';
            if (!formData.industry) newErrors.industry = 'Industry is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('sponza_auth', JSON.stringify({
                id: Date.now(),
                email: formData.email,
                name: formData.name,
                role,
                ...formData
            }));

            if (role === 'college') {
                navigate(createPageUrl('CollegeDashboard'));
            } else {
                navigate(createPageUrl('SponsorDashboard'));
            }
        }, 1500);
    };

    const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Media', 'Other'];
    const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
    const collegeTypes = ['University', 'College', 'Institute', 'Academy', 'School'];
    const budgetRanges = ['$1,000 - $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000+'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-lg">
                <Link to={createPageUrl('Home')} className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-[#1E3A8A]">Sponza</span>
                </Link>

                <Card className="p-8 shadow-xl border-0">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            step >= 1 ? 'bg-[#1E3A8A] text-white' : 'bg-slate-200 text-slate-500'
                        }`}>1</div>
                        <div className={`w-24 h-1 rounded ${step >= 2 ? 'bg-[#1E3A8A]' : 'bg-slate-200'}`} />
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            step >= 2 ? 'bg-[#1E3A8A] text-white' : 'bg-slate-200 text-slate-500'
                        }`}>2</div>
                    </div>

                    {step === 1 && (
                        <div>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Create Account</h1>
                                <p className="text-slate-600">Choose your role and set up credentials</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button type="button" onClick={() => setRole('college')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        role === 'college' ? 'border-[#1E3A8A] bg-[#1E3A8A]/5' : 'border-slate-200 hover:border-slate-300'
                                    }`}>
                                    <GraduationCap className={`w-10 h-10 mx-auto mb-3 ${
                                        role === 'college' ? 'text-[#1E3A8A]' : 'text-slate-400'
                                    }`} />
                                    <p className="font-semibold">College</p>
                                </button>

                                <button type="button" onClick={() => setRole('sponsor')}
                                    className={`p-6 rounded-xl border-2 transition-all ${
                                        role === 'sponsor' ? 'border-[#1E3A8A] bg-[#1E3A8A]/5' : 'border-slate-200 hover:border-slate-300'
                                    }`}>
                                    <Building2 className={`w-10 h-10 mx-auto mb-3 ${
                                        role === 'sponsor' ? 'text-[#1E3A8A]' : 'text-slate-400'
                                    }`} />
                                    <p className="font-semibold">Sponsor</p>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label>Email</Label>
                                    <Input type="email" value={formData.email} onChange={(e)=>handleInputChange('email', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Password</Label>
                                    <Input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e)=>handleInputChange('password', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Confirm Password</Label>
                                    <Input type="password" value={formData.confirmPassword} onChange={(e)=>handleInputChange('confirmPassword', e.target.value)} />
                                </div>
                            </div>

                            <Button onClick={handleNext} className="w-full mt-6">Continue</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <Input placeholder="Name" value={formData.name} onChange={(e)=>handleInputChange('name', e.target.value)} />
                                <Input placeholder="Phone" value={formData.phone} onChange={(e)=>handleInputChange('phone', e.target.value)} />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button type="button" variant="outline" onClick={()=>setStep(1)}>Back</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
}
