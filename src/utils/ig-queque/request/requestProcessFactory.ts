import { Observable, Subject } from 'rxjs';
import { requestScheduleFactory } from './requesSheduleFactory';
import { Bot, Request } from '../types';
import { UserStoryFeedResponseItemsItem } from '@igpapi/android';

export const requestProcessFactory = <R = any>(
  request$: Subject<Request<R>>,
  freeBot$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
  botCounter$: Observable<number>,
  botNest$: Observable<Bot>,
  taskProcess: (
    request: Request<R>,
    bot: Bot,
  ) => Promise<UserStoryFeedResponseItemsItem[]>,
) => {
  request$.subscribe((request) => {
    console.log(`💦 new request ${request.targetUser}`);
  });

  const shedule = requestScheduleFactory(request$, freeBot$, botIsBusy$);

  shedule.subscribe(async ({ request, bot }) => {
    // TODO move to pipline
    console.log('☄️ Start task', { request, bot: bot.id });
    const result = await taskProcess(request, bot);
    request.resolve(result);
    setTimeout(() => {
      freeBot$.next(bot);
    }, 1000);
  });

  botNest$.subscribe((bot) => {
    console.log('SPAWN!!!!');
    freeBot$.next(bot);
  });
};
