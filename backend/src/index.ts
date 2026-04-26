import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';

import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// i18n setup
i18next.use(middleware.LanguageDetector).init({
  fallbackLng: 'en',
  preload: ['en', 'fr', 'pt'],
});

app.use(middleware.handle(i18next));
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Afera University API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
