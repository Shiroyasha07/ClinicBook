export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export type UserRole = 'patient' | 'staff' | 'admin';

export interface PatientProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  service: string;
  date: string; // ISO format
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}
