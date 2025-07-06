'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '@/lib/storage';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import RecentTransactions from '@/components/RecentTransactions';
import SummaryCards from '@/components/SummaryCards';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        const storedTransactions = getTransactions();
        setTransactions(storedTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTransaction = addTransaction(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      setShowAddDialog(false);
      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleEditTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;
    
    try {
      const updatedTransaction = updateTransaction(editingTransaction.id, transactionData);
      if (updatedTransaction) {
        setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updatedTransaction : t));
        setEditingTransaction(null);
        setShowEditDialog(false);
        toast.success('Transaction updated successfully');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = (id: string) => {
    try {
      const success = deleteTransaction(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        toast.success('Transaction deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const startEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Personal Finance Tracker
            </h1>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                </DialogHeader>
                <TransactionForm onSubmit={handleAddTransaction} />
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-gray-600">Track your income and expenses with beautiful visualizations and category insights</p>
        </div>

        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards transactions={transactions} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyExpensesChart transactions={transactions} />
            <div className="grid grid-cols-1 gap-6">
              <CategoryPieChart transactions={transactions} type="expense" />
            </div>
          </div>

          {/* Second Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryPieChart transactions={transactions} type="income" />
            <CategoryBreakdown transactions={transactions} />
          </div>

          {/* Recent Transactions and Full List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentTransactions transactions={transactions} />
            </div>
            <div className="lg:col-span-2">
              <TransactionList
                transactions={transactions}
                onEdit={startEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
            </DialogHeader>
            {editingTransaction && (
              <TransactionForm
                transaction={editingTransaction}
                onSubmit={handleEditTransaction}
                onCancel={() => {
                  setEditingTransaction(null);
                  setShowEditDialog(false);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  );
}