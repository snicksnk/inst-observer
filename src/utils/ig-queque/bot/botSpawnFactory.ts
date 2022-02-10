import { from, Observable, of, Subject, tap } from 'rxjs';
import { Bot } from '../types';
import { Bot as BotModel } from '@prisma/client';

import { session } from 'src/data/session';
import { session2 } from 'src/data/session2';

export const botSpawnFactory = (
  botCounter$: Observable<number>,
  getBotFromDb: () => Promise<BotModel[]>,
) =>
  new Observable<Bot>((subsribe) => {
    botCounter$.subscribe((count) => console.log('Counter--', count));

    getBotFromDb().then((botsModels) => {
      from(botsModels).subscribe((botModel) => {
        subsribe.next({
          id: String(botModel.id),
          session: botModel.session,
        });
      });
    });

    // subsribe.next({
    //   id: 'Bot_1',
    //   session: JSON.stringify(session),
    // });

    // subsribe.next({
    //   id: 'Bot_1',
    //   session: JSON.stringify(session2),
    // });
  });
