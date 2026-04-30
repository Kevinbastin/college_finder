export type CollegeType = 'GOVERNMENT' | 'PRIVATE';

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: CollegeType;
  establishedYear: number;
  totalStudents: number;
  naacGrade: string;
  annualFees: number;
  placementPct: number;
  avgPackage: number;
  highestPackage: number;
  topRecruiters: string[];
  courses: string[];
  description: string;
  about: string;
  website: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  cutoffRanks: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeWithChance extends College {
  chance: 'HIGH' | 'MODERATE' | 'LOW';
  cutoffRank?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedComparison {
  id: string;
  userId: string;
  signature: string;
  collegeIds: string[];
  createdAt: string;
  colleges?: College[];
}

export interface Question {
  id: string;
  text: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  user: { name: string };
  _count?: { answers: number };
  answers?: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  userId: string;
  questionId: string;
  createdAt: string;
  user: { name: string };
}

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  state: string;
  type: string;
  minFees: string;
  maxFees: string;
  naac: string[];
  minRating: string;
  courses: string[];
  page: number;
  sort: string;
}

export type ExamType = 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET' | 'CAT' | 'GATE';
