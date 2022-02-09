import { Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { requestScheduleFactory } from '../request/requesSheduleFactory';
import { Bot, Request } from '../types';
import { FixtureBotsList } from './fixtures';

// it(
//   "Test shedue",
//   marbles((m) => {
//     const botIsFree$ = m.cold("     ---a-c-|", values);
//     const botIsSpawned$ = m.hot("  -b-----|", values);
//     const expected = m.cold("      -b-a-c-|", values);

//     const requests$ = m.hot("      -a--a--b-c");
//     const freeBot$ = m.hot("       ");
//     const requestIsBusy$ = m.hot(" ");

//     const requestSchedule = requestScheduleFactory(requests$, freeBot$, requestIsBusy$);
//     // const botIsReady$ = botIsReadyFactory(botIsFree$, botIsSpawned$);

//     // m.expect(botIsReady$).toBeObservable(expected);
//     // m.expect(source).toHaveSubscriptions(subs);
//   })
// );

const REQUEST_1 = {
  targetUser: 'user1',
  resolve: () => {},
};

const REQUEST_2 = {
  targetUser: 'user2',
  resolve: () => {},
};

const FREE_BOT_V = {
  id: 'vasya',
  session: 'session',
};

const FREE_BOT_P = {
  id: 'vasya',
  session: 'session',
};

it('test whaiting for free bot', () => {
  const sheduleProcess = jest.fn();

  const request$ = new Subject<Request>();
  const freeBot$ = new Subject<Bot>();
  const botIsBusy$ = new Subject<Bot>();

  const schedule = requestScheduleFactory(request$, freeBot$, botIsBusy$);

  schedule.subscribe(sheduleProcess);
  request$.next(REQUEST_1);
  request$.next(REQUEST_2);
  freeBot$.next(FREE_BOT_V);

  expect(sheduleProcess).toBeCalledTimes(1);
  expect(sheduleProcess).toBeCalledWith({
    request: REQUEST_1,
    bot: FREE_BOT_V,
  });

  freeBot$.next(FREE_BOT_P);

  expect(sheduleProcess).toBeCalledTimes(2);
  expect(sheduleProcess).toBeCalledWith({
    request: REQUEST_2,
    bot: FREE_BOT_V,
  });
});

it('test whaiting for request', () => {
  const sheduleProcess = jest.fn();

  const request$ = new Subject<Request>();
  const freeBot$ = new Subject<Bot>();
  const botIsBusy$ = new Subject<Bot>();

  const schedule = requestScheduleFactory(request$, freeBot$, botIsBusy$);

  schedule.subscribe(sheduleProcess);
  freeBot$.next(FREE_BOT_V);
  request$.next(REQUEST_1);

  freeBot$.next(FREE_BOT_P);

  expect(sheduleProcess).toBeCalledTimes(1);
  expect(sheduleProcess).toBeCalledWith({
    request: REQUEST_1,
    bot: FREE_BOT_V,
  });
  request$.next(REQUEST_2);

  expect(sheduleProcess).toBeCalledTimes(2);
  expect(sheduleProcess).toBeCalledWith({
    request: REQUEST_2,
    bot: FREE_BOT_V,
  });
});
