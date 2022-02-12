import { createClient } from 'redis';
import { Injectable } from '@nestjs/common';
import { Bot, Request } from './utils/ig-queque/types';

@Injectable()
export class LogService {
  client: ReturnType<LogService['initRedis']>;
  constructor() {
    this.client = this.initRedis();
    this.client.connect();
  }

  initRedis() {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on('error', (err) => {
      console.error('Error ' + err);
    });

    return client;
  }

  async logRequest(bot: Bot, request: Request) {
    this.client.rPush(
      'requests-log',
      [
        'Result: ',
        ' success',
        '\nTargetUser:',
        request.targetUser,
        '\nBotId:',
        bot.id,
        '\nStart time: ',
        request.startTime,
        '\nEnd time',
        request.endTime,
        '\nDuration: ',
        request.duration,
      ].join(' '),
    );
  }

  async logRequestErr(bot: Bot, request: Request, e: Error) {
    this.client.rPush(
      'request-log',
      [
        'Result: ',
        ' fail',
        '\nTargetUser:',
        request.targetUser,
        '\nBotId:',
        bot.id,
        '\nStart time: ',
        request.startTime,
        '\nEnd time',
        request.endTime,
        '\nDuration: ',
        request.duration,
        e,
      ].join(' '),
    );
  }
}
