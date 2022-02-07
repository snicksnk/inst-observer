import { createClient } from 'redis';
import { Injectable } from '@nestjs/common';


@Injectable()
export class LogService {
  constructor() {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err) => {
      console.error('Error ' + err);
    });
  }
}
