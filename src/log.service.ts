import { createClient } from 'redis';
import { Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable()
export class LogService {
  logger: Logger;
  constructor() {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err) => {
      console.error('Error ' + err);
    });

    this.logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        // //
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.File({ filename: 'combined.log' }),
      ],
    });
  }
}
