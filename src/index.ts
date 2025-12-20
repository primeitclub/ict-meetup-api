import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDatabase from './shared/config/typeorm/db.config';
import { envConfig } from './shared/config/env';
import seedRouter from './modules/seed/seed.routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())
app.use('/api/seeds', seedRouter);

connectDatabase.initialize()
      .then(() => {
            console.log('Database connected successfully.');
            const PORT = envConfig.port || 3000;
            app.listen(PORT, () => {
                  console.log(`Server is running on port ${PORT}`);
            }); ``
      })
      .catch((error) => {
            console.error('Error connecting to the database', error);
      });