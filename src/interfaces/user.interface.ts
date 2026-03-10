export interface User {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  classe_name: string;
  studentId: number;
  classId: number;
  isFirstLogin?: boolean;
}
