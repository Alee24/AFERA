'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Download, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  X,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';
import Modal from '@/components/Modal';

export default function FinanceDashboard() {
  const { showNotification } = useNotification();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: '$0',
    outstanding: '$0',
    successfulPayments: '0',
    refundRequests: '0'
  });
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  
  const [billingAmount, setBillingAmount] = useState('');
  const [billingType, setBillingType] = useState<'invoice' | 'credit_note'>('invoice');
  const [billingDesc, setBillingDesc] = useState('');
  const [billingDueDate, setBillingDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invRes, statsRes, usersRes] = await Promise.all([
        api.get('/finance/all-invoices'),
        api.get('/finance/stats'),
        api.get('/users')
      ]);

      setInvoices(invRes.data.map((inv: any) => ({
        ...inv,
        realId: inv.id,
        id: inv.id?.slice(0, 8).toUpperCase() || 'N/A',
        student: inv.Student?.User ? `${inv.Student.User.first_name} ${inv.Student.User.last_name}` : 'External Student',
        amount: parseFloat(inv.total_amount) || 0,
        status: inv.status || 'pending',
        date: inv.created_at ? new Date(inv.created_at).toLocaleDateString() : 'N/A'
      })));
      
      setStats(statsRes.data);
      // Filter for students only
      setStudents(usersRes.data.filter((u: any) => u.role === 'student'));
    } catch (err) {
      console.error('Failed to load financial data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!studentSearch) return students;
    const term = studentSearch.toLowerCase();
    return students.filter(s => 
      s.first_name.toLowerCase().includes(term) || 
      s.last_name.toLowerCase().includes(term) || 
      s.email.toLowerCase().includes(term) ||
      s.StudentProfile?.admission_number?.toLowerCase().includes(term)
    );
  }, [students, studentSearch]);

  const handleMarkPaid = async (id: string) => {
    try {
      await api.put(`/finance/mock-pay/${id}`);
      showNotification('Invoice paid and receipt generated', 'success');
      fetchData();
    } catch (err) {
      showNotification('Failed to process payment', 'error');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/finance/invoices/${id}`);
      showNotification('Transaction deleted', 'success');
      fetchData();
    } catch (err) {
      showNotification('Delete failed', 'error');
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedStudent || !billingAmount) {
      showNotification('Please select a student and enter amount', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/finance/invoices', {
        student_id: selectedStudent.StudentProfile?.id,
        amount: parseFloat(billingAmount),
        description: billingDesc,
        billing_type: billingType,
        due_date: billingDueDate
      });
      showNotification(`${billingType === 'invoice' ? 'Invoice' : 'Credit Note'} issued successfully`, 'success');
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      showNotification('Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setStudentSearch('');
    setBillingAmount('');
    setBillingType('invoice');
    setBillingDesc('');
    setBillingDueDate('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Student', 'Amount', 'Status', 'Date'];
    const rows = invoices.map(inv => [inv.id, inv.student, inv.amount, inv.status, inv.date]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finance_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-primary dark:text-white tracking-tight">Financial Treasury</h2>
          <p className="text-gray-500 mt-2 font-medium">Monitoring revenue streams, student billing, and tuition processing.</p>
        </div>
         <div className="flex items-center space-x-3">
             <Button onClick={() => { setBillingType('invoice'); setIsModalOpen(true); }} className="bg-primary text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Plus size={16} className="mr-2" /> New Invoice
             </Button>
             <Button onClick={() => { setBillingType('credit_note'); setIsModalOpen(true); }} className="bg-emerald-500 text-white rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                <FileText size={16} className="mr-2" /> Issue Credit
             </Button>
             <Button onClick={handleExportCSV} variant="outline" className="border-gray-200 dark:border-slate-800 rounded-2xl px-6 h-12 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
                <Download size={16} className="mr-2" /> Export CSV
             </Button>
         </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, color: 'primary' },
           { label: 'Outstanding', value: stats.outstanding, icon: AlertCircle, color: 'amber' },
           { label: 'Successful Pmts', value: stats.successfulPayments, icon: TrendingUp, color: 'emerald' },
           { label: 'Refund Requests', value: stats.refundRequests, icon: ArrowDownCircle, color: 'rose' }
         ].map((stat, i) => (
           <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden group">
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{stat.label}</p>
                 <h3 className="text-3xl font-black text-primary dark:text-white">{stat.value}</h3>
              </div>
              <stat.icon className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-50 dark:text-slate-800 opacity-50 group-hover:scale-110 transition-transform" />
           </div>
         ))}
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="px-12 py-10 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/30">
           <div>
              <h3 className="text-xl font-bold text-primary dark:text-white">Transaction Ledger</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time tuition tracking</p>
           </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-12 py-8">ID</th>
                    <th className="px-12 py-8">Recipient</th>
                    <th className="px-12 py-8">Type/Desc</th>
                    <th className="px-12 py-8">Amount</th>
                    <th className="px-12 py-8">Status</th>
                    <th className="px-12 py-8">Settlement</th>
                    <th className="px-12 py-8 text-right">Action</th>
                 </tr>
              </thead>
              <tbody>
                 {invoices.map((invoice) => (
                   <tr key={invoice.realId} className="group hover:bg-gray-50/30 transition-colors border-b border-gray-50 dark:border-slate-800 last:border-0">
                      <td className="px-12 py-8">
                         <span className="text-sm font-black text-primary dark:text-white font-mono tracking-tighter">{invoice.id}</span>
                      </td>
                      <td className="px-12 py-8">
                         <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold">{invoice.student[0]}</div>
                            <span className="text-sm font-bold text-primary dark:text-white">{invoice.student}</span>
                         </div>
                      </td>
                      <td className="px-12 py-8">
                         <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${invoice.billing_type === 'credit_note' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                               {invoice.billing_type === 'credit_note' ? <ArrowDownCircle size={14} /> : <ArrowUpCircle size={14} />}
                            </div>
                            <div>
                               <p className="text-sm font-bold text-primary dark:text-white uppercase tracking-tight">{invoice.billing_type === 'credit_note' ? 'Credit Note' : 'Tuition Fee'}</p>
                               <p className="text-[10px] text-gray-400 font-medium">{invoice.notes || 'N/A'}</p>
                            </div>
                         </div>
                      </td>
                      <td className={`px-12 py-8 text-sm font-black ${invoice.billing_type === 'credit_note' ? 'text-emerald-500' : 'text-primary dark:text-white'}`}>
                         {invoice.billing_type === 'credit_note' ? '-' : ''}${Math.abs(invoice.amount).toLocaleString()}
                      </td>
                      <td className="px-12 py-8">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-500' : 
                            invoice.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                         }`}>
                            {invoice.status}
                         </span>
                      </td>
                      <td className="px-12 py-8 text-[10px] font-bold text-gray-500">
                         {invoice.Receipts?.[0] ? (
                           <div className="flex flex-col">
                              <span className="text-emerald-500">Paid via {invoice.Receipts[0].payment_method}</span>
                              <span className="text-[8px] opacity-60">Ref: {invoice.Receipts[0].transaction_ref}</span>
                           </div>
                         ) : 'Pending Settlement'}
                      </td>
                      <td className="px-12 py-8 text-right">
                         <div className="flex items-center justify-end space-x-2">
                            {invoice.status !== 'paid' && (
                              <Button onClick={() => handleMarkPaid(invoice.realId)} variant="ghost" className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg">
                                 <CheckCircle2 size={18} />
                              </Button>
                            )}
                            <Button onClick={() => handleDeleteInvoice(invoice.realId)} variant="ghost" className="p-2 hover:bg-red-50 text-red-400 rounded-lg">
                               <AlertCircle size={18} />
                            </Button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
            </table>
        </div>
      </div>

      {/* Issuance Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={billingType === 'credit_note' ? 'Issue Credit Note' : 'Issue New Invoice'}>
         <div className="p-10">
            <div className="space-y-6">
               {/* Searchable Student Select */}
               <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Student / Recipient</label>
                  {selectedStudent ? (
                    <div className="flex items-center justify-between h-14 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500/20 rounded-2xl px-6 transition-all animate-in fade-in slide-in-from-top-1">
                       <div className="flex items-center space-x-3">
                          <UserCheck className="text-emerald-500" size={20} />
                          <div>
                             <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                             <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">{selectedStudent.StudentProfile?.admission_number}</p>
                          </div>
                       </div>
                       <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-emerald-500/10 rounded-full text-emerald-500">
                          <X size={16} />
                       </button>
                    </div>
                  ) : (
                    <div className="relative">
                       <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                       <input 
                         type="text" 
                         value={studentSearch}
                         onChange={(e) => { setStudentSearch(e.target.value); setShowStudentDropdown(true); }}
                         onFocus={() => setShowStudentDropdown(true)}
                         className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-14 font-bold text-sm" 
                         placeholder="Search student name or admission ID..." 
                       />
                       
                       <AnimatePresence>
                          {showStudentDropdown && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               exit={{ opacity: 0, y: 10 }}
                               className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 max-h-64 overflow-y-auto overflow-x-hidden custom-scrollbar py-2"
                             >
                                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                                   <button 
                                     key={s.id} 
                                     onClick={() => { setSelectedStudent(s); setShowStudentDropdown(false); }}
                                     className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
                                   >
                                      <div>
                                         <p className="text-sm font-bold text-primary dark:text-white">{s.first_name} {s.last_name}</p>
                                         <p className="text-[10px] text-gray-400 font-medium">{s.email}</p>
                                      </div>
                                      <span className="text-[10px] font-black text-primary/40 dark:text-white/20 uppercase tracking-widest font-mono">
                                         {s.StudentProfile?.admission_number}
                                      </span>
                                   </button>
                                )) : (
                                   <div className="px-6 py-8 text-center text-gray-400 font-medium italic text-xs">No students found...</div>
                                )}
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Transaction Type</label>
                     <select value={billingType} onChange={(e: any) => setBillingType(e.target.value)} className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold text-sm">
                        <option value="invoice">Invoice / Tuition</option>
                        <option value="credit_note">Credit Note / Refund</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Amount ($)</label>
                     <input value={billingAmount} onChange={e => setBillingAmount(e.target.value)} type="number" className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" placeholder="0.00" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Due Date (Optional)</label>
                  <input value={billingDueDate} onChange={e => setBillingDueDate(e.target.value)} type="date" className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl px-6 font-bold" />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Internal Notes</label>
                  <textarea value={billingDesc} onChange={e => setBillingDesc(e.target.value)} className="w-full h-24 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-6 font-bold text-sm" placeholder="Purpose of this transaction..." />
               </div>

               <Button onClick={handleGenerateInvoice} disabled={submitting} className={`w-full h-16 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl transition-all ${billingType === 'credit_note' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-primary shadow-primary/20'}`}>
                  {submitting ? 'Processing...' : `Issue ${billingType === 'credit_note' ? 'Credit Note' : 'Invoice'}`}
               </Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}
