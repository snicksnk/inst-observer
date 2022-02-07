import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { Subject } from 'rxjs';
import { AppService } from './app.service';
import { createRequestFactory } from './utils/ig-queque/createRequestFactory';
import { requestScheduleFactory } from './utils/ig-queque/requesSheduleFactory';
import { requestProcessFactory } from './utils/ig-queque/requestProcessFactory';
import { Bot, Request } from './utils/ig-queque/types';

// const request$ = new Subject<Request>();
// const freeBot$ = new Subject<Bot>();
// const botIsBusy$ = new Subject<Bot>();

// const processRequest = (request: Request, bot: Bot) =>
//   new Promise((res) =>
//     setTimeout(() => res(` ️ Process compleate ${request.targetUser}`), 5000),
//   );


// const requestProcess$ = requestProcessFactory(
//   request$,
//   freeBot$,
//   botIsBusy$,
//   processRequest,
// );

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:targetUser')
  @ApiParam({ name: 'targetUser', required: true })
  async getHello(@Param('targetUser') targetUser) {
    return await this.appService.getUserStory(targetUser);
  }
}
