import { UserStoryFeedResponseItemsItem } from '@igpapi/android';
import { Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles';
import { botCounterFactory } from '../bot/botCounterFactory';
import { botSpawnFactory } from '../bot/botSpawnFactory';
import { requestProcessFactory } from '../request/requestProcessFactory';
import { Bot, Request } from '../types';
import { FixtureBotsList, FixtureRequests, FixtureRespones } from './fixtures';

describe('Bot nest test', () => {
  let request$: Subject<Request<UserStoryFeedResponseItemsItem[]>>;
  let freeBot$: Subject<Bot>;
  let botIsBusy$: Subject<Bot>;
  // let botCounter$: ReturnType<typeof botCounterFactory>;
  // let botNest$: ReturnType<typeof botSpawnFactory>;

  beforeEach(() => {
    request$ = new Subject<Request<UserStoryFeedResponseItemsItem[]>>();
    freeBot$ = new Subject<Bot>();
    botIsBusy$ = new Subject<Bot>();
  });

  it(
    'Test',
    marbles((m) => {
      const getBot = jest.fn();
      const processRequest = jest.fn();
      const botCounter$ = botCounterFactory(freeBot$, botIsBusy$);
      const botNest$ = botSpawnFactory(botCounter$, getBot);

      const req = m.cold('      -a-b-c', FixtureRequests);
      const bots = m.cold('     --a-b-', FixtureBotsList);
      const expected = m.cold(' ------', FixtureRespones);
      req.subscribe((r) => request$.next(r));
      bots.subscribe((b) => freeBot$.next(b));

      const requestProcess$ = requestProcessFactory<
        UserStoryFeedResponseItemsItem[]
      >(request$, freeBot$, botIsBusy$, botCounter$, botNest$, processRequest);

      // m.expect(botNest).toBeObservable(expected);
    }),
  );

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
