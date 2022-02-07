import { marbles } from 'rxjs-marbles/jest';

import { botIsReadyFactory } from '../botIsReadyFactory';
import { FixtureBotsList } from './fixtures';

describe('botIseReadyFactory test', () => {
  it(
    'Bot ready pipe',
    marbles((m) => {
      const botIsFree$ = m.cold('     ---a-c-|', FixtureBotsList);
      const botIsSpawned$ = m.hot('  -b-----|', FixtureBotsList);
      const expected = m.cold('      -b-a-c-|', FixtureBotsList);

      const botIsReady$ = botIsReadyFactory(botIsFree$, botIsSpawned$);

      m.expect(botIsReady$).toBeObservable(expected);
    }),
  );
});
