export type UserRole = 'worker' | 'employer' | 'both' | 'admin';
export type EducationStatus = 'educated' | 'not_educated';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  education?: EducationStatus;
  educationDegree?: string;
  avatar?: string;
  createdAt: string;
}

export type WorkType = 'Full-time' | 'Part-time' | 'Temporary' | 'Any';
export type PaymentUnit = 'day' | 'month' | 'hour' | 'job';

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  profilePhoto: string;
  mobile: string;
  email: string;
  age: number;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
  mainSkill: string;
  otherSkills: string[];
  experienceYears: number;
  previousWorkExperience: string;
  workDescription: string;
  workType: WorkType;
  preferredLocation: string;
  maxTravelDistanceKm: number;
  expectedPayment: {
    amount: number;
    unit: PaymentUnit;
  };
  preferredWorkingHours: string;
  availableDays: string[];
  isAvailable: boolean;
  isVisible: boolean;
  rating: number;
  reviewCount: number;
  isVerified?: boolean;
  isFlagged?: boolean;
  portfolioImages?: string[];
  createdAt: string;

  // Extra Hands & Services Provided fields
  profileCategory?: 'extra_hands' | 'service';
  isOnlineToWork?: boolean;
  isEducated?: boolean;
  educationTitle?: string;
  freeTimeDetails?: string;
  businessName?: string;
  serviceType?: string;
}

export interface JobPost {
  id: string;
  userId: string;
  employerName: string;
  mobile: string;
  email: string;
  jobTitle: string;
  requiredWorkerSkill: string;
  jobDescription: string;
  workersNeeded: number;
  workLocation: string;
  city: string;
  latitude: number;
  longitude: number;
  workDate: string;
  workDuration: string;
  workingHours: string;
  salary: {
    amount: number;
    unit: PaymentUnit;
  };
  experienceRequiredYears: number;
  additionalRequirements: string;
  jobPhoto?: string;
  status: 'active' | 'closed' | 'flagged';
  viewsCount: number;
  callClicksCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  jobCount?: number;
  workerCount?: number;
}

export interface Review {
  id: string;
  workerId: string;
  reviewerName: string;
  reviewerMobile?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface ReportItem {
  id: string;
  targetType: 'job' | 'worker';
  targetId: string;
  targetTitle: string;
  reason: string;
  reportedBy: string;
  date: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface LocationCoordinates {
  name: string;
  latitude: number;
  longitude: number;
}

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta';

export interface CallHistoryItem {
  id: string;
  type: 'worker' | 'job';
  targetId: string;
  targetName: string;
  targetSkillOrTitle: string;
  phone: string;
  location: string;
  rate?: string;
  calledAt: string;
}

