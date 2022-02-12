import {
  catchError,
  delay,
  map,
  mergeMap,
  Observable,
  Subject,
  tap,
  throwError,
  zip,
} from 'rxjs';
import { requestScheduleFactory } from './requesSheduleFactory';
import { Bot, Request } from '../types';

export const requestProcessFactory = <R = any>(
  request$: Subject<Request<R>>,
  freeBot$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
  botCounter$: Observable<number>,
  botNest$: Observable<Bot>,
  // taskProcess: (
  //   request: Request<R>,
  //   bot: Bot,
  // ) => Promise<UserStoryFeedResponseItemsItem[]>,
) => {
  request$.subscribe((request) => {
    console.log(`💦 new request ${request.targetUser}`);
  });

  botNest$.subscribe((bot) => {
    freeBot$.next(bot);
  });

  const shedule = requestScheduleFactory(request$, freeBot$, botIsBusy$);

  return shedule.pipe(
    tap(({ request, bot }) =>
      console.log('☄️ Start task', { request, botId: bot.id }),
    ),
    mergeMap(({ request, bot }) => {
      return request.process(request, bot);
    }),
    tap(({ result, request }) => request.resolve(result)),
    delay(3000),
    tap(({ bot }) => {
      freeBot$.next(bot);
    }),
  );
};