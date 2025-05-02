import { DistributionData, Topper, SubjectToppersData } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDistribution = async (): Promise<DistributionData[]> => {
  const response = await fetch(`${API_URL}/api/statistics/distribution`);
  if (!response.ok) throw new Error('Failed to fetch distribution data');
  return response.json();
};

export const fetchToppers = async (): Promise<Topper[]> => {
  const response = await fetch(`${API_URL}/api/statistics/toppers`);
  if (!response.ok) throw new Error('Failed to fetch toppers data');
  return response.json();
};

export const fetchSubjectToppers = async (): Promise<SubjectToppersData[]> => {
  const response = await fetch(`${API_URL}/api/statistics/subjectwise-toppers`);
  console.log('Subject Toppers Data:', response);
  if (!response.ok) throw new Error('Failed to fetch subject toppers data');
  return response.json();
};

export interface SubjectDistribution {
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

export const fetchSubjectDistribution = async (subject: string): Promise<SubjectDistribution> => {
  const response = await fetch(`${API_URL}/api/statistics/subject-distribution/${subject}`);
  if (!response.ok) throw new Error('Failed to fetch subject distribution data');
  return response.json();
};
