import { BehaviorSubject, map, mapTo, merge, Observable, Subject } from 'rxjs';
import { Bot } from '../types';

export const botCounterFactory = (
  botIsFree$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
) =>
  new Observable<number>((subsribe) => {
    const botCount$ = new BehaviorSubject<number>(0);

    const botList$ = new BehaviorSubject<{
      busy: Array<Bot['id']>;
      free: Array<Bot['id']>;
    }>({
      busy: [],
      free: [],
    });

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

      const curVal = botList$.getValue();
      if (val.inc > 0) {
        console.log(`🏃 Bot is free ${val.bot.id}`);
        botList$.next({
          ...curVal,
          free: [...curVal.free, val.bot.id],
          busy: curVal.busy.filter((id) => id !== val.bot.id),
        });
      } else {
        console.log(`👩‍💻 Bot is busy ${val.bot.id}`);
        botList$.next({
          ...curVal,
          free: curVal.free.filter((id) => id !== val.bot.id),
          busy: [...curVal.busy, val.bot.id],
        });
      }
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
