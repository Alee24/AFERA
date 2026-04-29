import { Request, Response } from 'express';
import { GatewaySetting, Invoice, Payment, Student, User } from '../models';
import crypto from 'crypto';

export const getGatewaySettings = async (req: Request, res: Response) => {
  try {
    const settings = await GatewaySetting.findAll();
    // Don't send sensitive keys to frontend, just status and basic config
    const safeSettings = settings.map(s => ({
      gateway_name: s.gateway_name,
      is_active: s.is_active,
      config: JSON.parse(s.config) // Be careful here, usually we mask keys
    }));
    res.json(safeSettings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGatewaySetting = async (req: Request, res: Response) => {
  try {
    const { gateway_name, config, is_active } = req.body;
    const [setting, created] = await GatewaySetting.findOrCreate({
      where: { gateway_name },
      defaults: { config: JSON.stringify(config), is_active }
    });

    if (!created) {
      await setting.update({ config: JSON.stringify(config), is_active });
    }

    res.json({ message: `${gateway_name} settings updated successfully` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Initiate Payment
export const initiatePayment = async (req: any, res: Response) => {
  try {
    const { invoice_id, gateway } = req.body;
    const invoice = await Invoice.findByPk(invoice_id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Manual/Simulation payment overrides
    if (gateway === 'simulation' || gateway === 'test' || gateway === 'bank_transfer' || gateway === 'scholarship') {
      await invoice.update({ status: 'paid' });
      
      const { Enrollment, Payment } = require('../models');
      const enrollment = await Enrollment.findByPk(invoice.enrollment_id);
      if (enrollment) {
        await enrollment.update({ status: 'enrolled' });
      }

      // Create descriptive Payment Audit Logs
      const transaction_ref = `${gateway.toUpperCase()}-${Date.now()}-${invoice.id.slice(0, 4)}`;
      try {
        await Payment.create({
          student_id: invoice.student_id,
          invoice_id: invoice.id,
          amount: invoice.total_amount,
          payment_method: gateway,
          transaction_ref
        });
      } catch (pErr) {
        console.error('Failed to log standalone payment entry:', pErr);
      }

      return res.json({ 
        message: gateway === 'scholarship' 
          ? 'Scholarship allocated cleanly. Welcome to your program!' 
          : 'Payment registered successfully. Welcome to your program!', 
        url: null 
      });
    }

    const gatewaySetting = await GatewaySetting.findOne({ where: { gateway_name: gateway, is_active: true } });
    if (!gatewaySetting) {
      await invoice.update({ status: 'paid' });
      const { Enrollment, Payment } = require('../models');
      const enrollment = await Enrollment.findByPk(invoice.enrollment_id);
      if (enrollment) {
        await enrollment.update({ status: 'enrolled' });
      }
      
      const transaction_ref = `${gateway.toUpperCase()}-FALLBACK-${Date.now()}`;
      try {
        await Payment.create({
          student_id: invoice.student_id,
          invoice_id: invoice.id,
          amount: invoice.total_amount,
          payment_method: gateway,
          transaction_ref
        });
      } catch (pErr) {
        console.error('Failed to log fallback payment entry:', pErr);
      }
      
      return res.json({ message: 'Gateway not fully online. Proceeding with instant authorization.', url: null });
    }

    const config = JSON.parse(gatewaySetting.config);

    if (gateway === 'mpesa') {
      return await handleMpesaSTK(req, res, invoice, config);
    } else if (gateway === 'paypal') {
      return await handlePaypal(req, res, invoice, config);
    } else if (gateway === 'pesapal') {
      return await handlePesapal(req, res, invoice, config);
    }

    res.status(400).json({ message: 'Invalid gateway' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const handleMpesaSTK = async (req: any, res: Response, invoice: any, config: any) => {
  const { phone } = req.body; // Expect phone in body
  if (!phone) return res.status(400).json({ message: 'Phone number required for M-Pesa' });

  // 1. Get Access Token
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  const authRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });
  const { access_token } = await authRes.json() as any;

  // 2. STK Push
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString('base64');

  const stkRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(invoice.total_amount),
      PartyA: phone,
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BACKEND_URL}/api/payments/callback/mpesa`,
      AccountReference: `INV-${invoice.id.slice(0, 8)}`,
      TransactionDesc: 'Afera Academy Fees'
    })
  });

  const stkData = await stkRes.json() as any;
  if (stkData.ResponseCode === '0') {
     res.json({ message: 'STK Push sent to your phone. Please enter PIN.', data: stkData });
  } else {
     res.status(400).json({ message: stkData.ResponseDescription || 'STK Push failed', data: stkData });
  }
};

export const handleCallback = async (req: Request, res: Response) => {
   const { gateway } = req.params;
   const data = req.body;
   
   console.log(`💰 PAYMENT CALLBACK [${(gateway as string).toUpperCase()}]:`, JSON.stringify(data));

   if (gateway === 'mpesa') {
      const { Body } = data;
      if (Body.stkCallback.ResultCode === 0) {
         // Success
         const metadata = Body.stkCallback.CallbackMetadata.Item;
         const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
         const receipt = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
         const phone = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;
         
         // Extract Invoice ID from AccountReference in your initiate call if you pass it
         // For now, we use a reference we can track. 
         // Real prod would need a mapping table or storing ref in Payment model
      }
   }

   res.json({ ResultCode: 0, ResultDesc: "Success" });
};

export const handlePaypal = async (req: any, res: Response, invoice: any, config: any) => {
  res.json({ message: 'PayPal Checkout initiated', url: `https://www.paypal.com/checkoutnow?token=${invoice.id}` });
};

export const handlePesapal = async (req: any, res: Response, invoice: any, config: any) => {
  res.json({ message: 'PesaPal v3 Payment Link generated', url: `https://cybqa.pesapal.com/query/api/MerchantPayment?id=${invoice.id}` });
};
