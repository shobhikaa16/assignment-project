export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#EF4444', icon: '🍽️' },
  { id: 'transportation', name: 'Transportation', color: '#3B82F6', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', color: '#8B5CF6', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', color: '#F59E0B', icon: '🎬' },
  { id: 'bills', name: 'Bills & Utilities', color: '#EF4444', icon: '💡' },
  { id: 'healthcare', name: 'Healthcare', color: '#10B981', icon: '🏥' },
  { id: 'education', name: 'Education', color: '#6366F1', icon: '📚' },
  { id: 'travel', name: 'Travel', color: '#EC4899', icon: '✈️' },
  { id: 'fitness', name: 'Fitness & Sports', color: '#14B8A6', icon: '💪' },
  { id: 'other', name: 'Other', color: '#6B7280', icon: '📦' }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: '#10B981', icon: '💼' },
  { id: 'freelance', name: 'Freelance', color: '#3B82F6', icon: '💻' },
  { id: 'business', name: 'Business', color: '#8B5CF6', icon: '🏢' },
  { id: 'investment', name: 'Investment', color: '#F59E0B', icon: '📈' },
  { id: 'rental', name: 'Rental Income', color: '#EC4899', icon: '🏠' },
  { id: 'gift', name: 'Gift/Bonus', color: '#14B8A6', icon: '🎁' },
  { id: 'other', name: 'Other', color: '#6B7280', icon: '💰' }
];