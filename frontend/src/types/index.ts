export interface Student {
  seat_number: string;
  student_name: string;
  mother_name: string;
  marathi: number;
  hindi: number;
  english: number;
  mathematics: number;
  science: number;
  social_science: number;
  additional_marks: number;
  total_marks: number;
  percentage: number;
  result_status: string;
}

export interface PerformanceData {
  distinction: number;
  firstClass: number;
  secondClass: number;
  pass: number;
  fail: number;
}

export interface DistributionData {
  grade: string;
  count: number;
}

export interface Topper {
  student_name: string;
  total_marks: number;
  percentage: number;
  additional_marks: number;
}

export interface Subject {
  id: string;
  name: string;
}

export interface SubjectTopper {
  student_name: string;
  marks: number;
}

export interface SubjectToppersData {
  subject: string;
  topStudents: SubjectTopper[];
}