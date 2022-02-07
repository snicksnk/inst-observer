import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Bot } from '../types';

export const botNestFactory = (
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

    botCount$.subscribe((count: number) => subsribe.next(count));
  });
