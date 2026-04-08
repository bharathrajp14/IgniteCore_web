export interface ContactFormData {
  name: string;
  businessName: string;
  email: string;
  whatsapp: string;
  projectType: string;
  message: string;
  consent: boolean;
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
