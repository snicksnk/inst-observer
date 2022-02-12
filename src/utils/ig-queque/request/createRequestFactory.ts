import { Observable, Subject } from 'rxjs';
import { Request, Bot } from '../types';

export const createRequestFactory = <Result>(
  request$: Subject<Request<Result>>,
  targetUser: string,
  process: (request: Request<Result>, bot: Bot) => Observable<Result>,
) =>
  new Promise<Result>((resolve) => {
    request$.next({
      targetUser,
      startTime: new Date(),
      resolve,
      process,
    });
  });
