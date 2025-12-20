import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDatabase from './shared/config/typeorm/db.config';
import { envConfig } from './shared/config/env';
import { logAudit } from './shared/utils/audit.utils';
import { AuditLogType, AuditLogActionType, AuditLogScope } from './shared/constants/audit-log.constants';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())

// route for audit logging
// app.get('/test-audit', async (req, res) => {
//   try {
//     await logAudit({
//       logType: AuditLogType.INFO,
//       userId: '00000000-0000-0000-0000-000000000000',
//       logActionType: AuditLogActionType.CREATE,
//       message: 'Test audit log message',
//       versionId: '00000000-0000-0000-0000-000000000000',
//       scope: AuditLogScope.EVENTS,
//       ipAddress: req.ip,
//     });
//     res.json({ message: 'Audit log created successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create audit log' });
//   }
// });

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