import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Bot } from '../types';

export const botCounterFactory = (
  botIsFree$: Subject<Bot>,
  botIsBusy$: Subject<Bot>,
) =>
  new Observable<number>((subsribe) => {
    const botCount$ = new BehaviorSubject<number>(0);
    botIsFree$.subscribe(() => {
      botCount$.next(botCount$.getValue() + 1);
    });
    botIsBusy$.subscribe(() => {
      botCount$.next(botCount$.getValue() - 1);
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
