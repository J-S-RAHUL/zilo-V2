import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CallHistoryItem,
  Category,
  JobPost,
  LanguageCode,
  ReportItem,
  Review,
  User,
  WorkerProfile
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_JOBS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_WORKERS
} from '../data/seedData';
import { CityLocation, POPULAR_LOCATIONS } from '../utils/distance';
import { TRANSLATIONS } from '../utils/i18n';

interface CallContactInfo {
  phone: string;
  name: string;
  title: string;
  subtitle?: string;
  location?: string;
  rate?: string;
  avatar?: string;
  type: 'worker' | 'employer' | 'job';
  id: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  workers: WorkerProfile[];
  jobs: JobPost[];
  categories: Category[];
  reviews: Review[];
  reports: ReportItem[];
  currentLocation: CityLocation;
  setCurrentLocation: (loc: CityLocation) => void;
  useGpsLocation: () => Promise<void>;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  callModal: CallContactInfo | null;
  openCallModal: (info: CallContactInfo) => void;
  closeCallModal: () => void;
  selectedWorkerForDetail: WorkerProfile | null;
  setSelectedWorkerForDetail: (w: WorkerProfile | null) => void;
  selectedJobForDetail: JobPost | null;
  setSelectedJobForDetail: (j: JobPost | null) => void;
  reviewWorkerTarget: WorkerProfile | null;
  setReviewWorkerTarget: (w: WorkerProfile | null) => void;
  reportTarget: { type: 'job' | 'worker'; id: string; title: string } | null;
  setReportTarget: (target: { type: 'job' | 'worker'; id: string; title: string } | null) => void;
  postNewJob: (job: Omit<JobPost, 'id' | 'createdAt' | 'viewsCount' | 'callClicksCount'>) => string;
  updateJob: (id: string, updates: Partial<JobPost>) => void;
  deleteJob: (id: string) => void;
  createOrUpdateWorkerProfile: (profile: Omit<WorkerProfile, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => string;
  toggleWorkerAvailability: (workerId: string) => void;
  toggleWorkerVisibility: (workerId: string) => void;
  deleteWorker: (workerId: string) => void;
  addReview: (workerId: string, rating: number, comment: string, reviewerName: string, reviewerMobile?: string) => void;
  addReport: (type: 'job' | 'worker', id: string, title: string, reason: string) => void;
  addCategory: (name: string, description: string, icon?: string) => void;
  deleteCategory: (catId: string) => void;
  toggleJobStatus: (jobId: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  callHistory: CallHistoryItem[];
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  clearCallHistory: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  logout: () => void;
  t: (key: string) => string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  updateUserEducation: (education: 'educated' | 'not_educated', degree?: string) => void;
  toggleWorkerOnlineStatus: (workerId: string) => void;
  addExtraHandsProfile: (data: Partial<WorkerProfile>) => string;
  removeExtraHandsProfile: (workerId: string) => void;
  addServiceProfile: (data: Partial<WorkerProfile>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to strictly enforce only 1 profile per user/account in Extra Hands
const deduplicateExtraHands = (list: WorkerProfile[]): WorkerProfile[] => {
  const seenUserIds = new Set<string>();
  const seenMobiles = new Set<string>();
  const seenEmails = new Set<string>();
  const result: WorkerProfile[] = [];

  for (const w of list) {
    if (w.profileCategory === 'extra_hands') {
      const userKey = w.userId ? w.userId.trim().toLowerCase() : '';
      const mobileKey = w.mobile ? w.mobile.trim().replace(/\D/g, '') : '';
      const emailKey = w.email ? w.email.trim().toLowerCase() : '';

      const isDuplicate =
        (userKey && seenUserIds.has(userKey)) ||
        (mobileKey && seenMobiles.has(mobileKey)) ||
        (emailKey && seenEmails.has(emailKey));

      if (isDuplicate) {
        // Skip duplicate profile - only one profile can be kept in extra hands!
        continue;
      }

      if (userKey) seenUserIds.add(userKey);
      if (mobileKey) seenMobiles.add(mobileKey);
      if (emailKey) seenEmails.add(emailKey);
    }
    result.push(w);
  }
  return result;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // One-time purge of previously cached demo data in localStorage for v4 presentation release
  if (typeof window !== 'undefined') {
    const PURGE_KEY = 'zilo_v4_presentation_launch';
    if (!localStorage.getItem(PURGE_KEY)) {
      localStorage.removeItem('zilo_workers');
      localStorage.removeItem('zilo_jobs');
      localStorage.removeItem('zilo_reviews');
      localStorage.removeItem('zilo_reports');
      localStorage.removeItem('zilo_call_history');
      localStorage.removeItem('zilo_current_user');
      localStorage.setItem(PURGE_KEY, 'true');
    }
  }

  // Load state from localStorage or initialize with seed data
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zilo_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Ramesh by default
  });

  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    const saved = localStorage.getItem('zilo_workers');
    const rawList: WorkerProfile[] = saved ? JSON.parse(saved) : INITIAL_WORKERS;
    return deduplicateExtraHands(rawList);
  });

  const [jobs, setJobs] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem('zilo_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_JOBS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('zilo_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('zilo_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('zilo_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentLocation, setCurrentLocation] = useState<CityLocation>(() => {
    const saved = localStorage.getItem('zilo_location');
    return saved ? JSON.parse(saved) : POPULAR_LOCATIONS[0]; // Vijayawada
  });

  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modals
  const [callModal, setCallModal] = useState<CallContactInfo | null>(null);
  const [selectedWorkerForDetail, setSelectedWorkerForDetail] = useState<WorkerProfile | null>(null);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobPost | null>(null);
  const [reviewWorkerTarget, setReviewWorkerTarget] = useState<WorkerProfile | null>(null);
  const [reportTarget, setReportTarget] = useState<{ type: 'job' | 'worker'; id: string; title: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.');
  };

  // Direct Call History tracking
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>(() => {
    const saved = localStorage.getItem('zilo_call_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'call-demo-1',
        type: 'worker',
        targetId: 'worker-1',
        targetName: 'Ravi Kumar',
        targetSkillOrTitle: 'Carpenter (5 Years Experience)',
        phone: '9876543211',
        location: 'Benz Circle, Vijayawada',
        rate: '₹800/day',
        calledAt: '2026-09-30T10:15:00.000Z'
      },
      {
        id: 'call-demo-2',
        type: 'job',
        targetId: 'job-1',
        targetName: 'Ramesh (Employer)',
        targetSkillOrTitle: 'Carpenter Required • 3 Days',
        phone: '9876543210',
        location: 'Benz Circle, Vijayawada',
        rate: '₹800/day',
        calledAt: '2026-09-29T14:30:00.000Z'
      }
    ];
  });

  // Saved Jobs for Worker Dashboard
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('zilo_saved_jobs');
    return saved ? JSON.parse(saved) : ['job-1', 'job-2'];
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('zilo_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('zilo_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('zilo_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('zilo_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('zilo_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('zilo_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('zilo_location', JSON.stringify(currentLocation));
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem('zilo_call_history', JSON.stringify(callHistory));
  }, [callHistory]);

  useEffect(() => {
    localStorage.setItem('zilo_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  // Use GPS geolocation
  const useGpsLocation = async () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentLocation({
          name: 'My Exact GPS Location',
          state: 'Live GPS',
          lat: latitude,
          lng: longitude
        });
        showToast('📍 Updated location to your GPS coordinates.');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        showToast('Could not fetch GPS. Defaulting to Vijayawada.');
      }
    );
  };

  // Call modal trigger & analytics counter
  const openCallModal = (info: CallContactInfo) => {
    setCallModal(info);
    if (info.type === 'job') {
      setJobs((prev) =>
        prev.map((j) => (j.id === info.id ? { ...j, callClicksCount: (j.callClicksCount || 0) + 1 } : j))
      );
    }

    // Auto-record to direct Call History
    const newCallItem: CallHistoryItem = {
      id: `call-${Date.now()}`,
      type: info.type === 'job' ? 'job' : 'worker',
      targetId: info.id,
      targetName: info.name,
      targetSkillOrTitle: info.title,
      phone: info.phone,
      location: info.location || currentLocation.name,
      rate: info.rate,
      calledAt: new Date().toISOString()
    };
    setCallHistory((prev) => [newCallItem, ...prev.filter((c) => c.targetId !== info.id)]);
  };

  const closeCallModal = () => setCallModal(null);

  // Post new job
  const postNewJob = (jobData: Omit<JobPost, 'id' | 'createdAt' | 'viewsCount' | 'callClicksCount'>): string => {
    const newId = `job-${Date.now()}`;
    const newJob: JobPost = {
      ...jobData,
      id: newId,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      callClicksCount: 0
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast('🎉 Worker requirement posted successfully!');
    return newId;
  };

  const updateJob = (id: string, updates: Partial<JobPost>) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...updates } : j)));
    showToast('Job requirement updated.');
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    showToast('Job listing removed.');
  };

  const toggleJobStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: j.status === 'active' ? 'closed' : 'active' } : j))
    );
    showToast('Job listing status updated.');
  };

  // Worker profile create/update
  const createOrUpdateWorkerProfile = (
    profileData: Omit<WorkerProfile, 'id' | 'createdAt' | 'rating' | 'reviewCount'>
  ): string => {
    const existingIndex = workers.findIndex((w) => w.userId === profileData.userId);
    if (existingIndex >= 0) {
      const updated = {
        ...workers[existingIndex],
        ...profileData
      };
      setWorkers((prev) => prev.map((w, idx) => (idx === existingIndex ? updated : w)));
      showToast('Worker profile updated successfully.');
      return workers[existingIndex].id;
    } else {
      const newId = `worker-${Date.now()}`;
      const newWorker: WorkerProfile = {
        ...profileData,
        id: newId,
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        isVerified: true
      };
      setWorkers((prev) => [newWorker, ...prev]);
      showToast('✨ Worker profile published live! Employers can now call you directly.');
      return newId;
    }
  };

  const toggleWorkerAvailability = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const updated = !w.isAvailable;
          showToast(updated ? '🟢 Status set to: Available for Work' : '🟡 Status set to: Currently Busy');
          return { ...w, isAvailable: updated };
        }
        return w;
      })
    );
  };

  const toggleWorkerVisibility = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const updated = !w.isVisible;
          showToast(updated ? 'Profile is now Visible to all employers' : 'Profile hidden from public search');
          return { ...w, isVisible: updated };
        }
        return w;
      })
    );
  };

  const deleteWorker = (workerId: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    showToast('Worker profile deleted.');
  };

  const updateUserEducation = (education: 'educated' | 'not_educated', degree?: string) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      education,
      educationDegree: degree || currentUser.educationDegree || (education === 'educated' ? 'Graduate / Educated' : 'Standard')
    };
    setCurrentUser(updatedUser);
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.userId === currentUser.id && w.profileCategory === 'extra_hands') {
          return {
            ...w,
            isEducated: education === 'educated',
            educationTitle: degree || (education === 'educated' ? 'Educated Profile' : 'Standard')
          };
        }
        return w;
      })
    );
    showToast(`🎓 Education profile updated: ${education === 'educated' ? 'Educated' : 'Not Educated'}`);
  };

  const toggleWorkerOnlineStatus = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const nextOnline = !w.isOnlineToWork;
          showToast(nextOnline ? '🟢 You are now ONLINE to work in free time!' : '⚪ You are now OFFLINE for free-time work.');
          return { ...w, isOnlineToWork: nextOnline };
        }
        return w;
      })
    );
  };

  const removeExtraHandsProfile = (workerId: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    showToast('🗑️ Profile removed from Extra Hands. You can now create a new profile if needed.');
  };

  const addExtraHandsProfile = (data: Partial<WorkerProfile>): string => {
    const targetUserId = currentUser?.id || data.userId;
    const targetMobile = (data.mobile || currentUser?.mobile || '').trim();
    const targetEmail = (data.email || currentUser?.email || '').trim().toLowerCase();
    const isUserEducated = currentUser?.education === 'educated' || data.isEducated === true;

    // STRICT RULE: Only ONE profile can be kept in Extra Hands per user / phone number
    const existingIndex = workers.findIndex(
      (w) =>
        w.profileCategory === 'extra_hands' &&
        ((targetUserId && w.userId === targetUserId) ||
         (targetMobile && (w.mobile === targetMobile || w.mobile.replace(/\D/g, '') === targetMobile.replace(/\D/g, ''))) ||
         (targetEmail && w.email && w.email.toLowerCase() === targetEmail))
    );

    if (existingIndex >= 0) {
      const existing = workers[existingIndex];
      const updatedProfile: WorkerProfile = {
        ...existing,
        userId: targetUserId || existing.userId,
        fullName: data.fullName || existing.fullName,
        mobile: targetMobile || existing.mobile,
        email: targetEmail || existing.email,
        mainSkill: data.mainSkill || existing.mainSkill,
        otherSkills: data.otherSkills || existing.otherSkills,
        freeTimeDetails: data.freeTimeDetails !== undefined ? data.freeTimeDetails : existing.freeTimeDetails,
        expectedPayment: data.expectedPayment || existing.expectedPayment,
        workDescription: data.workDescription || existing.workDescription,
        isOnlineToWork: data.isOnlineToWork !== undefined ? data.isOnlineToWork : existing.isOnlineToWork,
        isEducated: isUserEducated,
        educationTitle: isUserEducated
          ? (currentUser?.educationDegree || data.educationTitle || 'Educated (Graduate / Diploma)')
          : 'Standard / Non-formal',
        location: data.location || existing.location,
        city: data.city || existing.city
      };

      setWorkers((prev) => deduplicateExtraHands(prev.map((w, idx) => (idx === existingIndex ? updatedProfile : w))));
      showToast('✅ Updated your active Extra Hands profile! (Only 1 profile permitted per user)');
      return existing.id;
    }

    const newId = `eh-${Date.now()}`;
    const newProfile: WorkerProfile = {
      id: newId,
      userId: targetUserId || `user-anon-${Date.now()}`,
      fullName: data.fullName || currentUser?.name || 'Helper Profile',
      profilePhoto: data.profilePhoto || currentUser?.avatar || 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&auto=format&fit=crop&q=80',
      mobile: targetMobile || '9876543210',
      email: targetEmail || '',
      age: data.age || 25,
      location: data.location || currentLocation.name,
      city: data.city || currentLocation.name,
      latitude: currentLocation.lat + (Math.random() - 0.5) * 0.03,
      longitude: currentLocation.lng + (Math.random() - 0.5) * 0.03,
      mainSkill: data.mainSkill || 'General Extra Hands Helper',
      otherSkills: data.otherSkills || ['Free-time helper', 'Quick response'],
      experienceYears: data.experienceYears || 1,
      previousWorkExperience: data.previousWorkExperience || 'Available for flexible free-time assistance.',
      workDescription: data.workDescription || 'Ready to assist in free time with high sincerity.',
      workType: 'Part-time',
      preferredLocation: data.location || currentLocation.name,
      maxTravelDistanceKm: data.maxTravelDistanceKm || 20,
      expectedPayment: data.expectedPayment || { amount: 300, unit: 'hour' },
      preferredWorkingHours: data.preferredWorkingHours || 'Evenings & Weekends',
      availableDays: data.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isAvailable: true,
      isVisible: true,
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
      profileCategory: 'extra_hands',
      isOnlineToWork: data.isOnlineToWork !== undefined ? data.isOnlineToWork : true,
      isEducated: isUserEducated,
      educationTitle: isUserEducated ? (currentUser?.educationDegree || data.educationTitle || 'Educated (Graduate / Diploma)') : 'Standard / Non-formal',
      freeTimeDetails: data.freeTimeDetails || 'Available in free time'
    };
    setWorkers((prev) => deduplicateExtraHands([newProfile, ...prev]));
    showToast(isUserEducated 
      ? '🎉 Profile added to "Educated" in Extra Hands (1 profile kept)!' 
      : '🎉 Profile added to "All" in Extra Hands (1 profile kept)!');
    return newId;
  };

  const addServiceProfile = (data: Partial<WorkerProfile>): string => {
    const newId = `srv-${Date.now()}`;
    const newProfile: WorkerProfile = {
      id: newId,
      userId: currentUser?.id || `user-service-${Date.now()}`,
      fullName: data.fullName || currentUser?.name || 'Service Provider',
      profilePhoto: data.profilePhoto || currentUser?.avatar || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      mobile: data.mobile || currentUser?.mobile || '9876543210',
      email: data.email || currentUser?.email || '',
      age: data.age || 35,
      location: data.location || currentLocation.name,
      city: data.city || currentLocation.name,
      latitude: currentLocation.lat + (Math.random() - 0.5) * 0.03,
      longitude: currentLocation.lng + (Math.random() - 0.5) * 0.03,
      mainSkill: data.mainSkill || 'Plumber',
      otherSkills: data.otherSkills || ['Emergency Service', 'All Time Available', 'Experienced'],
      experienceYears: data.experienceYears || 5,
      previousWorkExperience: data.previousWorkExperience || 'Professional service business serving local customers full-time.',
      workDescription: data.workDescription || 'All-time professional service business. Direct phone booking with transparent pricing.',
      workType: 'Full-time',
      preferredLocation: data.location || currentLocation.name,
      maxTravelDistanceKm: data.maxTravelDistanceKm || 30,
      expectedPayment: data.expectedPayment || { amount: 400, unit: 'job' },
      preferredWorkingHours: data.preferredWorkingHours || 'All-time (8 AM - 8 PM)',
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isAvailable: true,
      isVisible: true,
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      createdAt: new Date().toISOString(),
      profileCategory: 'service',
      businessName: data.businessName || `${data.mainSkill || 'Service'} Solutions`,
      serviceType: data.serviceType || (data.mainSkill || 'other').toLowerCase()
    };
    setWorkers((prev) => [newProfile, ...prev]);
    showToast('🛠️ Service business profile published! Customers can call you directly all time.');
    return newId;
  };

  // Add review
  const addReview = (
    workerId: string,
    rating: number,
    comment: string,
    reviewerName: string,
    reviewerMobile?: string
  ) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      workerId,
      reviewerName,
      reviewerMobile,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate worker rating
    const workerReviews = updatedReviews.filter((r) => r.workerId === workerId);
    const avgRating =
      workerReviews.reduce((sum, r) => sum + r.rating, 0) / (workerReviews.length || 1);

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              rating: Math.round(avgRating * 10) / 10,
              reviewCount: workerReviews.length
            }
          : w
      )
    );

    showToast('⭐ Thank you! Your rating and review have been recorded.');
  };

  // Add report
  const addReport = (type: 'job' | 'worker', id: string, title: string, reason: string) => {
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      targetType: type,
      targetId: id,
      targetTitle: title,
      reason,
      reportedBy: currentUser ? currentUser.name : 'Anonymous User',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('Listing reported to Zilo administrators for immediate review.');
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    showToast(`Report marked as ${action}.`);
  };

  // Categories
  const addCategory = (name: string, description: string, icon = 'Wrench') => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      description,
      icon
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`New category "${name}" added.`);
  };

  const deleteCategory = (catId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    showToast('Category removed.');
  };

  // Saved Jobs & Call History handlers
  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const updated = exists ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      showToast(exists ? 'Job removed from saved list.' : 'Job saved to your dashboard!');
      return updated;
    });
  };

  const isJobSaved = (jobId: string) => savedJobIds.includes(jobId);

  const clearCallHistory = () => {
    setCallHistory([]);
    showToast('Call history cleared.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        workers,
        jobs,
        categories,
        reviews,
        reports,
        currentLocation,
        setCurrentLocation,
        useGpsLocation,
        language,
        setLanguage,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        callModal,
        openCallModal,
        closeCallModal,
        selectedWorkerForDetail,
        setSelectedWorkerForDetail,
        selectedJobForDetail,
        setSelectedJobForDetail,
        reviewWorkerTarget,
        setReviewWorkerTarget,
        reportTarget,
        setReportTarget,
        postNewJob,
        updateJob,
        deleteJob,
        createOrUpdateWorkerProfile,
        toggleWorkerAvailability,
        toggleWorkerVisibility,
        deleteWorker,
        addReview,
        addReport,
        addCategory,
        deleteCategory,
        toggleJobStatus,
        resolveReport,
        callHistory,
        savedJobIds,
        toggleSaveJob,
        isJobSaved,
        clearCallHistory,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        logout,
        t,
        toastMessage,
        showToast,
        updateUserEducation,
        toggleWorkerOnlineStatus,
        addExtraHandsProfile,
        removeExtraHandsProfile,
        addServiceProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
