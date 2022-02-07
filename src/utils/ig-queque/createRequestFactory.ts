import { Subject } from 'rxjs';
import { Request } from './types';

export const createRequestFactory = (
  request$: Subject<Request>,
  targetUser: string,
) =>
  new Promise((res) => {
    request$.next({
      targetUser,
      resolve: res,
    });
  });
