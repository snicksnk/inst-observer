import { merge, Observable, tap } from 'rxjs';
import { Bot } from './types';

export const botIsReadyFactory = (
  botIsFree$: Observable<Bot>,
  botIsSpawned$: Observable<Bot>,
) => {
  return merge(botIsFree$, botIsSpawned$).pipe(
    tap((bot) => console.info('Bot is ready', bot)),
  );
};
