import { BehaviorSubject, map, mapTo, merge, Observable, Subject } from 'rxjs';
import { Bot } from '../types';

export const botCounterFactory = (
  botIsFree$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
) =>
  new Observable<number>((subsribe) => {
    const botCount$ = new BehaviorSubject<number>(0);

    botCount$.subscribe((c) => {
      console.log('count--- ', c);
    });

    const botList$ = new BehaviorSubject<
      Array<{
        inc: number;
        bot: Bot['id'];
      }>
    >([]);

    botList$.subscribe((b) => console.log('bot--list', b));

    const freeBots$ = botIsFree$.pipe(
      map((bot) => ({
        bot,
        inc: 1,
      })),
    );

    const busyBots$ = botIsBusy$.pipe(
      map((bot) => ({
        bot,
        inc: -1,
      })),
    );

    merge(freeBots$, busyBots$).subscribe((val) => {
      // botList$.next([
      //   ...botList$.getValue(),
      //   { bot: val.bot['id'], inc: val.inc },
      // ]);
      botCount$.next(botCount$.getValue() + val.inc);
    });

    // subsribe.next({
    //   id: 'Bot_1',
    //   session: JSON.stringify(session),
    // });

    // subsribe.next({
    //   id: 'Bot_1',
    //   session: JSON.stringify(session2),
    // });

    botCount$.subscribe((count: number) => subsribe.next(count));
  });
