export const MANPOWER_SUMMARY = {
  activeRequirements: 3,
  agencyResponses: 12,
  interviewsScheduled: 5,
  selectedStaff: 8
};

export const FREQUENT_ROLES = [
  { id: '1', title: 'Chef', icon: 'ChefHat' },
  { id: '2', title: 'Waiter', icon: 'Utensils' },
  { id: '3', title: 'Captain', icon: 'UserCircle' },
  { id: '4', title: 'Housekeeping', icon: 'Sparkles' },
  { id: '5', title: 'Kitchen Helper', icon: 'Knife' },
  { id: '6', title: 'Receptionist', icon: 'Phone' },
  { id: '7', title: 'Bartender', icon: 'GlassWater' },
];

export const ALL_REQUIREMENTS = [
  {
    id: 'REQ-091',
    role: 'Head Chef',
    staffRequired: 2,
    salary: '₹40,000 - ₹50,000',
    joiningDate: '15 Aug 2026',
    postedDate: 'Today',
    responses: 4,
    status: 'Responses'
  },
  {
    id: 'REQ-088',
    role: 'Wait Staff',
    staffRequired: 5,
    salary: '₹15,000 - ₹18,000',
    joiningDate: '20 Aug 2026',
    postedDate: '2 Days Ago',
    responses: 0,
    status: 'Active'
  },
  {
    id: 'REQ-085',
    role: 'Bartender',
    staffRequired: 1,
    salary: '₹20,000 - ₹25,000',
    joiningDate: '01 Sep 2026',
    postedDate: '1 Week Ago',
    responses: 2,
    status: 'Interviewing'
  },
  {
    id: 'REQ-080',
    role: 'Housekeeping Staff',
    staffRequired: 3,
    salary: '₹12,000 - ₹15,000',
    joiningDate: '10 Jul 2026',
    postedDate: '1 Month Ago',
    responses: 12,
    status: 'Filled'
  },
  {
    id: 'REQ-075',
    role: 'Receptionist',
    staffRequired: 1,
    salary: '₹18,000 - ₹22,000',
    joiningDate: '15 Jun 2026',
    postedDate: '2 Months Ago',
    responses: 5,
    status: 'Closed'
  }
];

export const RECENT_REQUIREMENTS = ALL_REQUIREMENTS.slice(0, 2);

export const ALL_RESPONSES = [
  {
    id: 'RES-101',
    agencyName: 'Elite Staffing Co.',
    verified: true,
    rating: 4.8,
    role: 'Head Chef',
    candidatesOffered: 2,
    serviceCharge: '8.33%',
    replacementPeriod: '90 Days',
    joiningTime: 'Immediate',
  },
  {
    id: 'RES-102',
    agencyName: 'HospitalityHR',
    verified: true,
    rating: 4.5,
    role: 'Head Chef',
    candidatesOffered: 5,
    serviceCharge: '1 Month Salary',
    replacementPeriod: '60 Days',
    joiningTime: '1 Week',
  },
  {
    id: 'RES-103',
    agencyName: 'QuickHire Solutions',
    verified: false,
    rating: 4.2,
    role: 'Head Chef',
    candidatesOffered: 1,
    serviceCharge: '5%',
    replacementPeriod: '30 Days',
    joiningTime: '15 Days',
  }
];

export const RECENT_RESPONSES = ALL_RESPONSES.slice(0, 2);

export const UPCOMING_INTERVIEWS = [
  {
    id: 'INT-301',
    candidateName: 'Rajesh Kumar',
    role: 'Head Chef',
    agency: 'Elite Staffing Co.',
    date: 'Tomorrow',
    time: '11:00 AM',
    type: 'In-person'
  },
  {
    id: 'INT-302',
    candidateName: 'Priya Sharma',
    role: 'Wait Staff',
    agency: 'HospitalityHR',
    date: 'Tomorrow',
    time: '02:00 PM',
    type: 'Video Call'
  }
];

export const TOP_AGENCIES = [
  {
    id: 'AG-01',
    name: 'Elite Staffing Co.',
    logo: 'E',
    verified: true,
    rating: 4.8,
    experience: '8 Years',
    availableStaff: 145,
    replacementPolicy: '90 Days',
    location: 'Mumbai, MH'
  },
  {
    id: 'AG-02',
    name: 'HospitalityHR',
    logo: 'H',
    verified: true,
    rating: 4.5,
    experience: '5 Years',
    availableStaff: 89,
    replacementPolicy: '60 Days',
    location: 'Pune, MH'
  },
  {
    id: 'AG-03',
    name: 'QuickHire Solutions',
    logo: 'Q',
    verified: false,
    rating: 4.2,
    experience: '2 Years',
    availableStaff: 54,
    replacementPolicy: '30 Days',
    location: 'Mumbai, MH'
  }
];

export const CANDIDATES = [
  {
    id: 'CAND-001',
    name: 'Ravi Kumar',
    photo: 'R',
    role: 'Head Chef',
    experience: '8 Years',
    expectedSalary: '₹45,000',
    availability: 'Immediate',
    skills: ['Indian', 'Continental', 'Menu Planning'],
    languages: ['English', 'Hindi', 'Marathi'],
    previousEmployer: 'Taj Lands End',
    rating: 4.8
  },
  {
    id: 'CAND-002',
    name: 'Sunita Sharma',
    photo: 'S',
    role: 'Housekeeping',
    experience: '3 Years',
    expectedSalary: '₹14,000',
    availability: '1 Week',
    skills: ['Deep Cleaning', 'Laundry', 'Sanitization'],
    languages: ['Hindi'],
    previousEmployer: 'ITC Maratha',
    rating: 4.5
  }
];

export const SELECTED_STAFF = [
  {
    id: 'EMP-901',
    name: 'Amit Patel',
    photo: 'A',
    role: 'Bartender',
    agency: 'Elite Staffing Co.',
    joiningDate: '01 Jul 2026',
    status: 'Active'
  },
  {
    id: 'EMP-902',
    name: 'Vikram Singh',
    photo: 'V',
    role: 'Captain',
    agency: 'HospitalityHR',
    joiningDate: '15 Jun 2026',
    status: 'Active'
  }
];

export const REPLACEMENT_HISTORY = [
  {
    id: 'REP-101',
    employeeName: 'Suresh Menon',
    agency: 'Elite Staffing Co.',
    reason: 'Medical Leave',
    requestDate: '10 Jul 2026',
    status: 'Pending'
  },
  {
    id: 'REP-088',
    employeeName: 'Anil Kapoor',
    agency: 'HospitalityHR',
    reason: 'Performance Issues',
    requestDate: '01 Jun 2026',
    status: 'Completed'
  }
];
