import { Request, Response } from 'express';
import { SystemSetting } from '../models';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await SystemSetting.findAll();
    const settingsMap = settings.reduce((acc: any, setting: any) => {
      try {
        acc[setting.key] = JSON.parse(setting.value);
      } catch (e) {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {});

    // Provide defaults if not found
    const defaults = {
      site_name: 'Afera Innov Academy',
      site_description: 'Transforming road infrastructure systems across Africa.',
      logo_url: '/logo.png',
      footer_logo_url: '/logo-footer.png',
      contact_email: 'info@aferainnov.africa',
      contact_phone: '+254 700 000000',
      contact_address: 'Nairobi, Kenya',
      color_primary: '#051A31',
      color_accent: '#E7AB33'
    };

    const finalSettings = { ...defaults, ...settingsMap };
    res.json(finalSettings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const settings = req.body; // Expect key-value object

    for (const [key, value] of Object.entries(settings)) {
      const [setting, created] = await SystemSetting.findOrCreate({
        where: { key },
        defaults: { value: JSON.stringify(value) }
      });

      if (!created) {
        await setting.update({ value: JSON.stringify(value) });
      }
    }

    res.json({ message: 'System settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
