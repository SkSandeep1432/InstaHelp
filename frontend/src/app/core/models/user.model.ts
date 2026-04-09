export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EXPERT' | 'CUSTOMER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  token?: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  id: number;
  status: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  category?: string;
  description?: string;
  skills?: string;
  experienceYears?: number;
  location?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ExpertProfile {
  id: number;
  userId: number;
  name: string;
  email: string;
  status: string;
  rejectionReason?: string;
  category: string;
  description: string;
  skills: string;
  experienceYears: number;
  location: string;
  profileImageUrl: string;
  averageRating: number;
  totalReviews: number;
  available?: boolean;
}
