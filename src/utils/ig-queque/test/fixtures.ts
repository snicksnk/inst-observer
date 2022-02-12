import { Bot, Request } from '../types';

export const FixtureBotsList: Record<string, Bot> = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
].reduce((acc, val) => {
  const newBot = {
    [val]: {
      id: `BOT_${val}`,
      session: 'session',
    },
  };

  return { ...acc, ...newBot };
}, {});

export const FixtureRespones: Record<string, { res: string }> = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
].reduce((acc, val) => {
  const newRequest = {
    [val]: {
      res: `RESP_${val}`,
    },
  };

  return { ...acc, ...newRequest };
}, {});

export const FixtureRequests: Record<string, Request> = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
].reduce((acc, val) => {
  const newRequest = {
    [val]: {
      targetUser: 'USER_A',
      resolve: () => Promise.resolve(FixtureRespones[val]),
    },
  };

  return { ...acc, ...newRequest };
}, {});