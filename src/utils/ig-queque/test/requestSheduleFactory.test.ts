import { Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { requestScheduleFactory } from '../request/requesSheduleFactory';
import { Bot, Request } from '../types';
import { FixtureBotsList, FixtureRequests } from './fixtures';

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

const REQUEST_1 = FixtureRequests.a;

const REQUEST_2 = FixtureRequests.b;

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

it('test whaiting for request', () => {
  const sheduleProcess = jest.fn();

  const request$ = new Subject<Request>();
  const freeBot$ = new Subject<Bot>();
  const botIsBusy$ = new Subject<Bot>();

  const schedule = requestScheduleFactory(request$, freeBot$, botIsBusy$, -1);

  const Resolve = jest.fn();
  const Reject = jest.fn();
  const Process = jest.fn();
  const TIMEOUT_REQ: Request = {
    targetUser: '1234',
    params: {},
    process: Process,
    startTime: new Date(),
    resolve: () => Resolve,
    reject: Reject,
  };

  schedule.subscribe(sheduleProcess);
  // freeBot$.next(FREE_BOT_V);
  request$.next(TIMEOUT_REQ);

  expect(Reject).toBeCalledTimes(1);
  expect(Resolve).toBeCalledTimes(0);
  expect(Process).toBeCalledTimes(0);
});
