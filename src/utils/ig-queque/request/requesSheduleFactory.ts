import { map, merge, Observable, Subject, tap, zip } from 'rxjs';
import { Bot, Request } from '../types';

export const requestScheduleFactory = (
  request$: Subject<Request>,
  freeBot$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
) =>
  zip(request$, freeBot$).pipe(
    map(([request, bot]) => ({
      request,
      bot,
    })),
    tap(({ request, bot }) => console.log('Launch request', request.targetUser, 'with bot', bot.id)),
    tap(({ bot }) => botIsBusy$.next(bot)),
  );

export const botIsReadyFactory = (
  botIsFree$: Observable<Bot>,
  botIsSpawned$: Observable<Bot>,
) => {
  return merge(botIsFree$, botIsSpawned$);
};
