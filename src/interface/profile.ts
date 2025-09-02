export interface CreateProfileInput {
  resume_url?: string;
  skills: string[];
  linkedin?: string;
  portfolio?: string;
  experiences?: {
    companyName: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  educations?: {
    school: string;
    duration?: string;
    cgpa?: number;
    description?: string;
  }[];
}