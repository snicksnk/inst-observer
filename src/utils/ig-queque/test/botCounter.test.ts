import { Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { botCounterFactory } from '../bot/botCounterFactory';
import { Bot } from '../types';
import { FixtureBotsList } from './fixtures';

describe('Bot nest test', () => {
  it(
    'Test shedue',
    marbles((m) => {
      const botIsFree$ = new Subject<Bot>();
      const botIsBusy$ = new Subject<Bot>();

      m.cold('-a', FixtureBotsList).subscribe((bot) => botIsFree$.next(bot));
      const expected = m.cold('ab', { a: 0, b: 1 });
      const botNest = botCounterFactory(botIsFree$, botIsBusy$);

      m.expect(botNest).toBeObservable(expected);
    }),
  );
});
