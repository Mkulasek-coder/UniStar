export type ResidencyStatus = 'Resident' | 'International';

export interface UserProfile {
  name: string;
  city: string;
  country: string;
  residency: ResidencyStatus;
  interests: string;
}

export interface CourseRecommendation {
  courseName: string;
  university: string;
  location: string;
  eligibility: string;
  schedule: string;
  fees: string;
  matchReason: string;
}

export type ViewState = 'onboarding' | 'loading' | 'results' | 'error';