'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  Download, 
  Receipt, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminFinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get('/finance/all-invoices');
        const data = res.data.map((inv: any) => ({
          id: inv.id?.slice(0, 8).toUpperCase() || 'N/A',
          student: inv.Student?.User ? `${inv.Student.User.first_name} ${inv.Student.User.last_name}` : 'External Student',
          amount: parseFloat(inv.total_amount) || 0,
          status: inv.status || 'pending',
          date: inv.created_at ? new Date(inv.created_at).toISOString().split('T')[0] : 'N/A'
        }));
        setInvoices(data);
      } catch (err) {
        console.error('Failed to load transaction ledger', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Financial Ecosystem</h1>
          <p className="text-gray-500 mt-2 font-medium">Monitoring revenue streams, student billing, and tuition processing.</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="outline" className="rounded-2xl border-gray-100 px-6">
              <Download size={18} className="mr-2" /> Financial Statement
           </Button>
           <Button className="bg-primary text-white rounded-2xl px-8 shadow-lg shadow-primary/20">
              <Plus size={18} className="mr-2" /> Generate Invoice
           </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: 'Total Revenue', value: '$284,500', trend: '+14%', icon: DollarSign, color: 'text-primary' },
           { label: 'Outstanding', value: '$12,400', trend: '+2%', icon: Clock, color: 'text-amber-500' },
           { label: 'Successful Payments', value: '412', trend: '+8%', icon: CheckCircle2, color: 'text-emerald-500' },
           { label: 'Refund Requests', value: '03', trend: '-12%', icon: AlertCircle, color: 'text-red-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary">
                    <stat.icon size={22} className={stat.color} />
                 </div>
                 <div className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} className="mr-1" /> {stat.trend}
                 </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3">{stat.label}</p>
              <h3 className="text-3xl font-black text-primary dark:text-white">{stat.value}</h3>
           </div>
         ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div>
              <h3 className="text-xl font-bold text-primary dark:text-white">Transaction Ledger</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time tuition tracking</p>
           </div>
           <div className="flex items-center space-x-3">
              <div className="relative w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input type="text" placeholder="Search invoices..." className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm border-none" />
              </div>
              <Button variant="outline" className="rounded-2xl border-gray-50 px-6">
                 <Filter size={18} className="mr-2" /> Filter
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-12 py-8">Invoice ID</th>
                    <th className="px-12 py-8">Recipient</th>
                    <th className="px-12 py-8">Amount</th>
                    <th className="px-12 py-8">Status</th>
                    <th className="px-12 py-8">Due Date</th>
                    <th className="px-12 py-8 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                 {invoices.map((inv) => (
                   <tr key={inv.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-12 py-8">
                         <span className="text-sm font-black text-primary dark:text-white font-mono tracking-tighter">{inv.id}</span>
                      </td>
                      <td className="px-12 py-8">
                         <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">{inv.student[0]}</div>
                            <span className="text-sm font-bold text-primary dark:text-white">{inv.student}</span>
                         </div>
                      </td>
                      <td className="px-12 py-8">
                         <span className="text-sm font-bold text-primary dark:text-white">${inv.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-12 py-8">
                         <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                            inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 
                            inv.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                         }`}>
                            {inv.status}
                         </span>
                      </td>
                      <td className="px-12 py-8">
                         <div className="flex items-center text-gray-400 text-xs font-medium">
                            <Calendar size={14} className="mr-2" /> {inv.date}
                         </div>
                      </td>
                      <td className="px-12 py-8 text-right">
                         <Button variant="ghost" className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400">
                            <Receipt size={20} />
                         </Button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Payment Methods & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-primary rounded-[56px] p-12 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <h4 className="text-2xl font-bold mb-4">Secured Gateway</h4>
               <p className="text-white/70 mb-10 text-sm leading-relaxed max-w-sm">
                  All transactions are encrypted and processed through our regional partners including M-Pesa, Stripe, and Direct Bank Transfers.
               </p>
               <div className="flex items-center space-x-6">
                  <div className="w-16 h-10 bg-white/10 rounded-lg backdrop-blur-md flex items-center justify-center">
                     <CreditCard size={24} className="text-white/50" />
                  </div>
                  <div className="w-16 h-10 bg-white/10 rounded-lg backdrop-blur-md flex items-center justify-center">
                     <DollarSign size={24} className="text-white/50" />
                  </div>
               </div>
            </div>
            <DollarSign size={240} className="absolute -right-20 -bottom-20 text-white/5 group-hover:scale-110 transition-transform duration-700" />
         </div>

         <div className="bg-white dark:bg-slate-900 rounded-[56px] p-12 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
               <h4 className="text-2xl font-bold text-primary dark:text-white mb-4">Fee Structures</h4>
               <p className="text-gray-500 text-sm leading-relaxed mb-10">
                  Manage global tuition fees, regional discounts, and scholarship allocations across all academy programs.
               </p>
            </div>
            <Button className="w-full bg-accent text-white hover:bg-primary rounded-3xl py-6 font-bold text-lg transition-all shadow-xl shadow-accent/20">
               Manage Fee Schedules
            </Button>
         </div>
      </div>

    </div>
  );
}
