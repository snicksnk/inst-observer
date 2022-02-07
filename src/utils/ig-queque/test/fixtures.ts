import { Bot, Request } from '../types';

export const FixtureBotsList: Record<string, Bot> = {
  a: {
    id: 'BOT_A',
    session: 'session',
  },
  b: {
    id: 'BOT_B',
    session: 'session',
  },
  c: {
    id: 'BOT_C',
    session: 'session',
  },
  d: {
    id: 'BOT_D',
    session: 'session',
  },
  e: {
    id: 'BOT_E',
    session: 'session',
  },
  f: {
    id: 'BOT_F',
    session: 'session',
  },
};

export const FixtureRequests: Record<string, Request> = {
  A: {
    targetUser: 'USER_A',
    resolve: () => {},
  },
  B: {
    targetUser: 'USER_B',
    resolve: () => {},
  },
  C: {
    targetUser: 'USER_C',
    resolve: () => {},
  },
  D: {
    targetUser: 'USER_D',
    resolve: () => {},
  },
  E: {
    targetUser: 'USER_E',
    resolve: () => {},
  },
  F: {
    targetUser: 'USER_F',
    resolve: () => {},
  },
};
