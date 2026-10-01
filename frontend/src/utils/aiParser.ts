import { JobPost, PaymentUnit } from '../types';
import { INITIAL_CATEGORIES } from '../data/seedData';
import { POPULAR_LOCATIONS } from './distance';

export interface ParsedJobRequirement {
  jobTitle: string;
  requiredWorkerSkill: string;
  workersNeeded: number;
  workLocation: string;
  city: string;
  workDuration: string;
  salaryAmount: number;
  salaryUnit: PaymentUnit;
  experienceRequiredYears: number;
  jobDescription: string;
  confidence: number;
}

export function parseNaturalLanguageJob(input: string): ParsedJobRequirement {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Detect Category/Skill
  let matchedSkill = 'General Worker';
  for (const cat of INITIAL_CATEGORIES) {
    const catLower = cat.name.toLowerCase();
    if (lower.includes(catLower) || (catLower === 'carpenter' && lower.includes('carpentry')) ||
        (catLower === 'electrician' && lower.includes('electrical')) ||
        (catLower === 'plumber' && lower.includes('plumbing')) ||
        (catLower === 'painter' && lower.includes('painting')) ||
        (catLower === 'driver' && (lower.includes('driving') || lower.includes('chauffeur'))) ||
        (catLower === 'cleaner' && (lower.includes('cleaning') || lower.includes('maid')))) {
      matchedSkill = cat.name;
      break;
    }
  }

  // 2. Detect City / Location
  let detectedCity = 'Vijayawada';
  let detectedLocation = 'Vijayawada';
  for (const loc of POPULAR_LOCATIONS) {
    if (lower.includes(loc.name.toLowerCase())) {
      detectedCity = loc.name;
      detectedLocation = loc.name;
      break;
    }
  }

  // 3. Detect Number of workers
  let workersNeeded = 1;
  const workersMatch = lower.match(/(\d+)\s*(?:workers?|carpenters?|electricians?|plumbers?|painters?|people|persons?|helpers?)/i);
  if (workersMatch) {
    const num = parseInt(workersMatch[1], 10);
    if (num > 0 && num <= 50) workersNeeded = num;
  } else if (lower.includes('two ')) {
    workersNeeded = 2;
  } else if (lower.includes('three ')) {
    workersNeeded = 3;
  } else if (lower.includes('four ')) {
    workersNeeded = 4;
  }

  // 4. Detect Salary & Unit
  let salaryAmount = 800;
  let salaryUnit: PaymentUnit = 'day';

  // Search for currency/number like ₹800, 800 rs, rs 800, 800/day, 15000/month
  const salaryMatch = lower.match(/(?:₹|rs\.?|inr)?\s*(\d{3,6})\s*(?:\/|\s+per\s+)?(day|daily|month|monthly|hour|hourly)?/i);
  if (salaryMatch) {
    const amt = parseInt(salaryMatch[1], 10);
    if (amt >= 200 && amt <= 200000) {
      salaryAmount = amt;
      const unitRaw = (salaryMatch[2] || '').toLowerCase();
      if (unitRaw.includes('month')) {
        salaryUnit = 'month';
      } else if (unitRaw.includes('hour')) {
        salaryUnit = 'hour';
      } else if (unitRaw.includes('day') || amt <= 2500) {
        salaryUnit = 'day';
      } else {
        salaryUnit = 'month';
      }
    }
  }

  // 5. Detect Duration
  let workDuration = '3 Days';
  const durationMatch = lower.match(/(\d+)\s*(days?|weeks?|months?|hours?)/i);
  if (durationMatch) {
    workDuration = `${durationMatch[1]} ${durationMatch[2].charAt(0).toUpperCase() + durationMatch[2].slice(1)}`;
  } else if (lower.includes('full-time') || lower.includes('full time') || lower.includes('monthly')) {
    workDuration = 'Full-time / Monthly';
    if (salaryUnit === 'day' && salaryAmount < 3000) {
      salaryUnit = 'month';
      salaryAmount = salaryAmount * 22; // rough convert if needed
    }
  } else if (lower.includes('one day') || lower.includes('1 day') || lower.includes('today') || lower.includes('tomorrow')) {
    workDuration = '1 Day';
  }

  // 6. Detect Experience
  let expYears = 2;
  const expMatch = lower.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:experience|exp)?/i);
  if (expMatch) {
    expYears = parseInt(expMatch[1], 10);
  } else if (lower.includes('fresher') || lower.includes('student') || lower.includes('helper')) {
    expYears = 0;
  }

  // Generate Title
  const jobTitle = `${matchedSkill} Required in ${detectedLocation}`;

  return {
    jobTitle,
    requiredWorkerSkill: matchedSkill,
    workersNeeded,
    workLocation: detectedLocation,
    city: detectedCity,
    workDuration,
    salaryAmount,
    salaryUnit,
    experienceRequiredYears: expYears,
    jobDescription: text,
    confidence: 94
  };
}

export interface SpamDetectionResult {
  score: number; // 0 to 100 (100 = verified safe, < 50 = risky)
  isSuspicious: boolean;
  warnings: string[];
}

export function evaluateJobTrustAndSafety(job: Partial<JobPost>): SpamDetectionResult {
  const warnings: string[] = [];
  let score = 100;

  const desc = (job.jobDescription || '').toLowerCase();
  const title = (job.jobTitle || '').toLowerCase();

  // Suspicious keywords indicative of scams
  const spamKeywords = [
    'registration fee',
    'pay advance',
    'security deposit to apply',
    'earn 50000 daily from home',
    'send otp',
    'click link to verify',
    'crypto',
    'bitcoin',
    'telegram link'
  ];

  for (const keyword of spamKeywords) {
    if (desc.includes(keyword) || title.includes(keyword)) {
      warnings.push(`Contains high-risk trigger phrase: "${keyword}"`);
      score -= 40;
    }
  }

  // Abnormal wages
  if (job.salary) {
    if (job.salary.unit === 'day' && job.salary.amount > 15000) {
      warnings.push('Unusually high daily wage claimed. Please verify authenticity.');
      score -= 25;
    }
    if (job.salary.unit === 'day' && job.salary.amount < 150) {
      warnings.push('Wage is below standard minimum daily worker rates.');
      score -= 15;
    }
  }

  // Phone number checks
  const phone = (job.mobile || '').replace(/\D/g, '');
  if (phone.length < 10) {
    warnings.push('Incomplete mobile number format.');
    score -= 20;
  }

  const clampedScore = Math.max(10, Math.min(100, score));
  return {
    score: clampedScore,
    isSuspicious: clampedScore < 60,
    warnings
  };
}
