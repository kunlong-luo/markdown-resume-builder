export interface FormItem {
  id: string;
  org: string;
  role: string;
  time: string;
  content: string;
  degree?: string;
  gpa?: string;
  courses?: string;
  honors?: string;
}

export interface FormSection {
  id: string;
  title: string;
  type: 'text' | 'items';
  textValue: string;
  items: FormItem[];
}

export interface ResumeFormModel {
  name: string;
  subtitle: string;
  phone: string;
  email: string;
  social: string;
  experience: string;
  workYears?: string;
  degree?: string;
  city?: string;
  jobStatus?: string;
  age?: string;
  sections: FormSection[];
}
