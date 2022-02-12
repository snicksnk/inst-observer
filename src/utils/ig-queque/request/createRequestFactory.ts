import { Observable, Subject } from 'rxjs';
import { Request, Bot } from '../types';

export const createRequestFactory = <Result>(
  request$: Subject<Request<Result>>,
  targetUser: string,
  params: Record<string, string | number>,
  process: (request: Request<Result>, bot: Bot) => Promise<Result>,
) =>
  new Promise<Result>((resolve) => {
    request$.next({
      targetUser,
      startTime: new Date(),
      resolve,
      process,
      params,
    });
  });
