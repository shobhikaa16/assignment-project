'use client';

import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart } from 'lucide-react';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export default function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const generateCategoryBreakdown = (type: 'income' | 'expense') => {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === type)
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
      });
    
    const total = Array.from(categoryMap.values()).reduce((sum, value) => sum + value, 0);
    
    return categories
      .map(category => ({
        ...category,
        amount: categoryMap.get(category.id) || 0,
        percentage: total > 0 ? ((categoryMap.get(category.id) || 0) / total) * 100 : 0
      }))
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  const expenseBreakdown = generateCategoryBreakdown('expense');
  const incomeBreakdown = generateCategoryBreakdown('income');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const CategorySection = ({ 
    title, 
    data, 
    type 
  }: { 
    title: string; 
    data: any[]; 
    type: 'income' | 'expense' 
  }) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        {title}
        <Badge variant="outline" className="text-xs">
          {data.length} categories
        </Badge>
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No {type} transactions yet</p>
      ) : (
        <div className="space-y-3">
          {data.map((category, index) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <Progress 
                value={category.percentage} 
                className="h-2"
                style={{
                  '--progress-background': category.color,
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategorySection 
          title="Expenses" 
          data={expenseBreakdown} 
          type="expense" 
        />
        <div className="border-t pt-6">
          <CategorySection 
            title="Income" 
            data={incomeBreakdown} 
            type="income" 
          />
        </div>
      </CardContent>
    </Card>
  );
}