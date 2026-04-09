export interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  expertId: number;
  expertName: string;
  expertEmail: string;
  requirementNote: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  createdAt: string;
  scheduledDate: string;
}

export interface BookingRequest {
  expertId: number;
  requirementNote: string;
  scheduledDate: string;
}

export interface Review {
  id: number;
  bookingId: number;
  customerId: number;
  customerName: string;
  expertId: number;
  expertName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRequest {
  bookingId: number;
  rating: number;
  comment: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
}

export interface DashboardStats {
  totalExperts?: number;
  pendingApprovals?: number;
  totalCustomers?: number;
  totalBookings?: number;
  pendingBookings?: number;
  acceptedBookings?: number;
  completedBookings?: number;
}
