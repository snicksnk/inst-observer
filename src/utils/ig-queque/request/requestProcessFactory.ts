import {
  catchError,
  delay,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  tap,
  throwError,
  zip,
} from 'rxjs';
import { requestScheduleFactory } from './requesSheduleFactory';
import { Bot, Request } from '../types';
import { IgQuequeError } from './error';
import CONFIG from 'src/config/common';

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

  const pipe = shedule.pipe(
    tap(({ request, bot }) =>
      console.log('☄️ Start task', { request, botId: bot.id }),
    ),
    mergeMap(({ request, bot }) => {
      return request.process(request, bot);
    }),
    tap(({ result, request, e }) => request.resolve(result || e)),
    tap((e) => {
      if (e instanceof IgQuequeError) {
        e.request.reject(e);
      }
    }),
    delay(CONFIG.bot.pauseAfterCompleateTask),
    tap((e) => {
      if (!(e instanceof IgQuequeError)) {
        freeBot$.next(e.bot);
      }
    }),
    // catchError((e: IgQuequeError) => {
    //   console.error('HAndle--errrr');
    //   e.request.resolve(e);
    //   return of(e);
    // }),
  );

  return pipe;
};
