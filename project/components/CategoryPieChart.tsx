'use client';

import { Transaction, CategoryData, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: 'income' | 'expense';
}

export default function CategoryPieChart({ transactions, type }: CategoryPieChartProps) {
  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  
  const generateCategoryData = (): CategoryData[] => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === type)
      .forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
      });
    
    return categories
      .map(category => ({
        name: category.name,
        value: categoryMap.get(category.id) || 0,
        color: category.color
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  const categoryData = generateCategoryData();
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className={`text-sm ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
            ${data.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate">{entry.value}</span>
            <span className="text-gray-500 ml-auto">
              ${categoryData.find(d => d.name === entry.value)?.value.toFixed(0)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {type === 'expense' ? (
              <TrendingDown className="w-5 h-5 text-red-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-green-600" />
            )}
            {type === 'expense' ? 'Expense' : 'Income'} Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No {type} transactions to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'expense' ? (
            <TrendingDown className="w-5 h-5 text-red-600" />
          ) : (
            <TrendingUp className="w-5 h-5 text-green-600" />
          )}
          {type === 'expense' ? 'Expense' : 'Income'} Categories
        </CardTitle>
        <p className="text-sm text-gray-600">
          Total {type}: <span className={`font-semibold ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
            ${total.toFixed(2)}
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend payload={categoryData.map(item => ({ value: item.name, color: item.color }))} />
      </CardContent>
    </Card>
  );
}