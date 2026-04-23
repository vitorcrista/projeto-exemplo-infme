export type Gender = 'M' | 'F' | 'O';

export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  snsNumber: string;
  createdAt?: string;
  updatedAt?: string;
}
