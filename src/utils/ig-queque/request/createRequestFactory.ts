import { Subject } from 'rxjs';
import { Request, Bot } from '../types';

export const createRequestFactory = <Result>(
  request$: Subject<Request<Result>>,
  targetUser: string,
  process: (request: Request<Result>, bot: Bot) => Promise<Result>,
) =>
  new Promise<Result>((resolve) => {
    request$.next({
      targetUser,
      resolve,
      process,
    });
  });
