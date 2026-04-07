export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
  interestType: 'investor' | 'partner' | 'client' | 'mentor';
}

export interface PitchSection {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon?: string;
}

export interface FinancialMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}
