// Dummy Users
export const dummyUsers = {
    college: {
        id: 1,
        name: 'Tech University',
        email: 'events@techuniversity.edu',
        role: 'college',
        avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
        collegeName: 'Tech University',
        location: 'San Francisco, CA',
        phone: '+1 (555) 123-4567',
    },
    sponsor: {
        id: 2,
        name: 'Acme Corp',
        email: 'sponsorship@acmecorp.com',
        role: 'sponsor',
        avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
        companyName: 'Acme Corporation',
        industry: 'Technology',
        website: 'https://acmecorp.com',
    },
    admin: {
        id: 3,
        name: 'Admin User',
        email: 'admin@sponza.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    }
};

// Dummy Events
export const dummyEvents = [
    {
        id: 1,
        title: 'TechFest 2024',
        description: 'The biggest technology festival featuring hackathons, workshops, and keynotes from industry leaders.',
        category: 'Tech',
        date: 'March 15-17, 2026',
        location: ' San Francisco',
        expectedAttendees: 5000,
        minSponsorship: 5000,
        maxSponsorship: 50000,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
        college: 'Tech University',
        status: 'Open',
        featured: true,
        packages: [
            { name: 'Platinum', price: 50000, benefits: ['Main stage banner', 'Booth space', 'Speaking slot', 'Logo on all materials'] },
            { name: 'Gold', price: 25000, benefits: ['Side banner', 'Booth space', 'Logo on materials'] },
            { name: 'Silver', price: 10000, benefits: ['Booth space', 'Logo on website'] },
            { name: 'Bronze', price: 5000, benefits: ['Logo on website', 'Social media mention'] },
        ]
    },
    {
        id: 2,
        title: 'Cultural Night 2024',
        description: 'A celebration of diversity featuring performances, food, and art from around the world.',
        category: 'Cultural',
        date: 'April 5, 2024',
        location: 'Arts Center, State College',
        expectedAttendees: 2000,
        minSponsorship: 2000,
        maxSponsorship: 20000,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
        college: 'State College',
        status: 'Open',
        featured: false,
        packages: [
            { name: 'Title Sponsor', price: 20000, benefits: ['Event naming rights', 'VIP seating', 'Banner display'] },
            { name: 'Co-Sponsor', price: 10000, benefits: ['Stage banner', 'Logo display'] },
            { name: 'Supporter', price: 2000, benefits: ['Program mention', 'Social media'] },
        ]
    },
    {
        id: 3,
        title: 'Sports Championship',
        description: 'Annual inter-college sports competition featuring basketball, soccer, and volleyball.',
        category: 'Sports',
        date: 'May 10-12, 2024',
        location: 'Stadium Complex, Central University',
        expectedAttendees: 8000,
        minSponsorship: 10000,
        maxSponsorship: 100000,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
        college: 'Central University',
        status: 'Open',
        featured: true,
        packages: [
            { name: 'Championship Partner', price: 100000, benefits: ['Jersey branding', 'Stadium naming', 'TV coverage'] },
            { name: 'Team Sponsor', price: 50000, benefits: ['Team jersey logo', 'Booth', 'Announcements'] },
            { name: 'Event Sponsor', price: 10000, benefits: ['Banner space', 'Program ads'] },
        ]
    },
    {
        id: 4,
        title: 'AI Workshop Series',
        description: 'Hands-on workshops covering machine learning, deep learning, and AI applications.',
        category: 'Workshop',
        date: 'June 1-2, 2024',
        location: 'Innovation Hub, Tech Institute',
        expectedAttendees: 500,
        minSponsorship: 3000,
        maxSponsorship: 15000,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
        college: 'Tech Institute',
        status: 'Open',
        featured: false,
        packages: [
            { name: 'Knowledge Partner', price: 15000, benefits: ['Workshop naming', 'Speaker slot', 'Lead access'] },
            { name: 'Tech Partner', price: 8000, benefits: ['Demo booth', 'Logo display'] },
            { name: 'Contributor', price: 3000, benefits: ['Thank you slide', 'Social mention'] },
        ]
    },
    {
        id: 5,
        title: 'Business Conference 2024',
        description: 'Annual conference bringing together entrepreneurs, investors, and business leaders.',
        category: 'Conference',
        date: 'July 20-21, 2024',
        location: 'Business School Auditorium',
        expectedAttendees: 1500,
        minSponsorship: 8000,
        maxSponsorship: 60000,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
        college: 'Business School',
        status: 'Open',
        featured: true,
        packages: [
            { name: 'Presenting Partner', price: 60000, benefits: ['Keynote intro', 'Premium booth', 'VIP dinner'] },
            { name: 'Associate Partner', price: 30000, benefits: ['Panel slot', 'Booth space'] },
            { name: 'Networking Partner', price: 8000, benefits: ['Lounge branding', 'Attendee list'] },
        ]
    },
];

// Dummy Sponsorship Requests (for College Dashboard)
export const dummySponsorshipRequests = [
    {
        id: 1,
        eventId: 1,
        eventTitle: 'TechFest 2024',
        sponsor: 'Acme Corporation',
        sponsorLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
        package: 'Gold',
        amount: 25000,
        status: 'pending',
        message: 'We are excited to sponsor TechFest and connect with young tech talent.',
        date: '2024-02-15',
    },
    {
        id: 2,
        eventId: 1,
        eventTitle: 'TechFest 2024',
        sponsor: 'TechGiant Inc',
        sponsorLogo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
        package: 'Platinum',
        amount: 50000,
        status: 'approved',
        message: 'Looking forward to being the main sponsor of this prestigious event.',
        date: '2024-02-10',
    },
    {
        id: 3,
        eventId: 4,
        eventTitle: 'AI Workshop Series',
        sponsor: 'DataSoft LLC',
        sponsorLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
        package: 'Knowledge Partner',
        amount: 15000,
        status: 'pending',
        message: 'We would love to share our AI expertise with students.',
        date: '2024-02-18',
    },
];

// Dummy Sponsorship History (for Sponsor Dashboard)
export const dummySponsorshipHistory = [
    {
        id: 1,
        eventId: 2,
        eventTitle: 'Innovation Summit 2023',
        college: 'Tech University',
        package: 'Gold',
        amount: 25000,
        status: 'completed',
        date: '2023-10-15',
    },
    {
        id: 2,
        eventId: 3,
        eventTitle: 'Startup Weekend',
        college: 'Business School',
        package: 'Silver',
        amount: 10000,
        status: 'completed',
        date: '2023-08-20',
    },
    {
        id: 3,
        eventId: 1,
        eventTitle: 'TechFest 2024',
        college: 'Tech University',
        package: 'Gold',
        amount: 25000,
        status: 'active',
        date: '2024-02-15',
    },
];

// Dummy Payment Records
export const dummyPaymentRecords = [
    {
        id: 1,
        sponsor: 'TechGiant Inc',
        event: 'TechFest 2024',
        amount: 50000,
        status: 'paid',
        date: '2024-02-12',
        method: 'Bank Transfer',
    },
    {
        id: 2,
        sponsor: 'Acme Corporation',
        event: 'TechFest 2024',
        amount: 25000,
        status: 'pending',
        date: '2024-02-15',
        method: 'Credit Card',
    },
    {
        id: 3,
        sponsor: 'DataSoft LLC',
        event: 'AI Workshop Series',
        amount: 15000,
        status: 'pending',
        date: '2024-02-18',
        method: 'Bank Transfer',
    },
];

// Dummy Admin Stats
export const dummyAdminStats = {
    totalUsers: 1250,
    totalColleges: 85,
    totalSponsors: 320,
    totalEvents: 156,
    totalSponsorship: 2500000,
    pendingApprovals: 23,
    activeEvents: 45,
    completedEvents: 111,
};

// All Users for Admin
export const allUsers = [
    { id: 1, name: 'Tech University', email: 'events@techuniversity.edu', role: 'college', status: 'active', joinDate: '2023-01-15' },
    { id: 2, name: 'Acme Corporation', email: 'sponsorship@acmecorp.com', role: 'sponsor', status: 'active', joinDate: '2023-02-20' },
    { id: 3, name: 'State College', email: 'events@statecollege.edu', role: 'college', status: 'active', joinDate: '2023-03-10' },
    { id: 4, name: 'TechGiant Inc', email: 'partner@techgiant.com', role: 'sponsor', status: 'active', joinDate: '2023-04-05' },
    { id: 5, name: 'Central University', email: 'events@central.edu', role: 'college', status: 'pending', joinDate: '2024-01-20' },
    { id: 6, name: 'DataSoft LLC', email: 'collab@datasoft.com', role: 'sponsor', status: 'active', joinDate: '2023-06-15' },
    { id: 7, name: 'Business School', email: 'events@bizschool.edu', role: 'college', status: 'active', joinDate: '2023-05-22' },
    { id: 8, name: 'StartupHub', email: 'sponsor@startuphub.com', role: 'sponsor', status: 'suspended', joinDate: '2023-07-30' },
];