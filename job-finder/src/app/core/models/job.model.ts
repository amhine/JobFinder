export interface Job {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}
