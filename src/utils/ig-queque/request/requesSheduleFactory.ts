import { map, merge, Observable, Subject, tap, zip, filter } from 'rxjs';
import { Bot, Request } from '../types';

export const requestScheduleFactory = (
  request$: Subject<Request>,
  freeBot$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
) => {
  const requestsNoTimeoOut$ = request$.pipe(
    // tap(a => console.log('before filter', a)),
    filter((req) => req.startTime.getTime() + 60000 > Date.now()),
    // tap(a => console.log('after filter', a)),
  );

  return zip(requestsNoTimeoOut$, freeBot$).pipe(
    map(([request, bot]) => ({
      request,
      bot,
    })),
    tap(({ bot }) => botIsBusy$.next(bot)),
    tap(({ request, bot }) =>
      console.log(`☀️ Launch request ${request.targetUser} with bot ${bot.id}`),
    ),
  );
};

export const botIsReadyFactory = (
  botIsFree$: Observable<Bot>,
  botIsSpawned$: Observable<Bot>,
) => {
  return merge(botIsFree$, botIsSpawned$);
};
