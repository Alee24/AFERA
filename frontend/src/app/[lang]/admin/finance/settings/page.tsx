'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Save, 
  ShieldCheck, 
  Smartphone, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function PaymentSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [gateways, setGateways] = useState<any>({
    mpesa: { is_active: false, config: { shortcode: '', consumerKey: '', consumerSecret: '', passkey: '' } },
    paypal: { is_active: false, config: { clientId: '', clientSecret: '', mode: 'sandbox' } },
    pesapal: { is_active: false, config: { consumerKey: '', consumerSecret: '', mode: 'sandbox' } }
  });

  const { showNotification } = useNotification();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/payments/settings');
      const apiSettings = res.data.reduce((acc: any, s: any) => {
        acc[s.gateway_name] = s;
        return acc;
      }, {});
      setGateways({ ...gateways, ...apiSettings });
    } catch (err) {
      showNotification('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (gatewayName: string) => {
    setSubmitting(gatewayName);
    try {
      await api.post('/payments/settings', {
        gateway_name: gatewayName,
        config: gateways[gatewayName].config,
        is_active: gateways[gatewayName].is_active
      });
      showNotification(`${gatewayName.toUpperCase()} settings saved!`, 'success');
    } catch (err) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setSubmitting(null);
    }
  };

  const updateConfig = (gateway: string, key: string, value: any) => {
    setGateways({
      ...gateways,
      [gateway]: {
        ...gateways[gateway],
        config: { ...gateways[gateway].config, [key]: value }
      }
    });
  };

  const toggleActive = (gateway: string) => {
    setGateways({
      ...gateways,
      [gateway]: { ...gateways[gateway], is_active: !gateways[gateway].is_active }
    });
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">Payment <span className="text-accent italic">Gateways</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Configure secure payment integrations for student tuition and fees.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* M-Pesa Integration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden flex flex-col">
           <div className="p-10 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/20">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <Smartphone size={24} />
                 </div>
                 <div>
                    <h3 className="font-black text-primary dark:text-white">Safaricom M-Pesa</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mobile Money Integration</p>
                 </div>
              </div>
              <button 
                onClick={() => toggleActive('mpesa')}
                className={`w-14 h-8 rounded-full transition-all relative ${gateways.mpesa.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${gateways.mpesa.is_active ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           
           <div className="p-10 space-y-6 flex-1">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Shortcode</label>
                 <input 
                   type="text" 
                   value={gateways.mpesa.config.shortcode}
                   onChange={e => updateConfig('mpesa', 'shortcode', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                   placeholder="e.g. 174379" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consumer Key</label>
                 <input 
                   type="password" 
                   value={gateways.mpesa.config.consumerKey}
                   onChange={e => updateConfig('mpesa', 'consumerKey', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consumer Secret</label>
                 <input 
                   type="password" 
                   value={gateways.mpesa.config.consumerSecret}
                   onChange={e => updateConfig('mpesa', 'consumerSecret', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Passkey (LNM)</label>
                 <input 
                   type="password" 
                   value={gateways.mpesa.config.passkey}
                   onChange={e => updateConfig('mpesa', 'passkey', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
           </div>

           <div className="p-10 border-t border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
              <Button 
                onClick={() => handleSave('mpesa')}
                disabled={submitting === 'mpesa'}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg"
              >
                {submitting === 'mpesa' ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Config</>}
              </Button>
           </div>
        </motion.div>

        {/* PayPal Integration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden flex flex-col">
           <div className="p-10 bg-blue-50 dark:bg-blue-900/10 flex items-center justify-between border-b border-blue-100 dark:border-blue-900/20">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <Globe size={24} />
                 </div>
                 <div>
                    <h3 className="font-black text-primary dark:text-white">PayPal Global</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">International Checkout</p>
                 </div>
              </div>
              <button 
                onClick={() => toggleActive('paypal')}
                className={`w-14 h-8 rounded-full transition-all relative ${gateways.paypal.is_active ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${gateways.paypal.is_active ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           
           <div className="p-10 space-y-6 flex-1">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">PayPal Mode</label>
                 <select 
                   value={gateways.paypal.config.mode}
                   onChange={e => updateConfig('paypal', 'mode', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold"
                 >
                    <option value="sandbox">Sandbox (Testing)</option>
                    <option value="live">Live (Production)</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Client ID</label>
                 <input 
                   type="password" 
                   value={gateways.paypal.config.clientId}
                   onChange={e => updateConfig('paypal', 'clientId', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Client Secret</label>
                 <input 
                   type="password" 
                   value={gateways.paypal.config.clientSecret}
                   onChange={e => updateConfig('paypal', 'clientSecret', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
           </div>

           <div className="p-10 border-t border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
              <Button 
                onClick={() => handleSave('paypal')}
                disabled={submitting === 'paypal'}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg"
              >
                {submitting === 'paypal' ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Config</>}
              </Button>
           </div>
        </motion.div>

        {/* PesaPal Integration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden flex flex-col">
           <div className="p-10 bg-orange-50 dark:bg-orange-900/10 flex items-center justify-between border-b border-orange-100 dark:border-orange-900/20">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                    <CreditCard size={24} />
                 </div>
                 <div>
                    <h3 className="font-black text-primary dark:text-white">PesaPal v3</h3>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">East Africa Hub</p>
                 </div>
              </div>
              <button 
                onClick={() => toggleActive('pesapal')}
                className={`w-14 h-8 rounded-full transition-all relative ${gateways.pesapal.is_active ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${gateways.pesapal.is_active ? 'left-7' : 'left-1'}`}></div>
              </button>
           </div>
           
           <div className="p-10 space-y-6 flex-1">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consumer Key</label>
                 <input 
                   type="password" 
                   value={gateways.pesapal.config.consumerKey}
                   onChange={e => updateConfig('pesapal', 'consumerKey', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consumer Secret</label>
                 <input 
                   type="password" 
                   value={gateways.pesapal.config.consumerSecret}
                   onChange={e => updateConfig('pesapal', 'consumerSecret', e.target.value)}
                   className="w-full h-14 bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-5 font-bold" 
                 />
              </div>
           </div>

           <div className="p-10 border-t border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
              <Button 
                onClick={() => handleSave('pesapal')}
                disabled={submitting === 'pesapal'}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg"
              >
                {submitting === 'pesapal' ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2" /> Save Config</>}
              </Button>
           </div>
        </motion.div>

      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-8 rounded-[32px] flex items-start space-x-6">
         <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
            <Lock size={24} />
         </div>
         <div>
            <h4 className="font-bold text-amber-800 dark:text-amber-200">Security Note</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">Payment credentials are encrypted at rest and never exposed to the public API. Ensure your callback/webhook URLs are correctly set in the gateway portals to receive payment confirmations.</p>
         </div>
      </div>
    </div>
  );
}
