import { Observable, Subject } from 'rxjs';
import { Bot } from '../types';

import { session } from 'src/data/session';
import { session2 } from 'src/data/session2';

export const botSpawnFactory = (botCounter$: Observable<number>) =>
  new Observable<Bot>((subsribe) => {
    botCounter$.subscribe((count) => console.log('Counter--', count));

    subsribe.next({
      id: 'Bot_1',
      session: JSON.stringify(session),
    });

    subsribe.next({
      id: 'Bot_1',
      session: JSON.stringify(session2),
    });
  });
