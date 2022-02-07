import { Subject } from 'rxjs';
import { requestScheduleFactory } from './requesSheduleFactory';
import { Bot, Request } from './types';

export const requestProcessFactory = (
  request$: Subject<Request>,
  freeBot$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
  taskProcess$: (request: Request, bot: Bot) => Promise<any>
) => {
  request$.subscribe((request) => {
    console.log(`💦 new request ${request.targetUser}`);
  });

  const shedule = requestScheduleFactory(request$, freeBot$, botIsBusy$);

  shedule.subscribe(async ({ request, bot }) => {
    console.log('☄️ Start task', { request, bot });
    const result = await taskProcess$(request, bot);
    request.resolve(result);
    freeBot$.next(bot);
  });
  return shedule;
};
