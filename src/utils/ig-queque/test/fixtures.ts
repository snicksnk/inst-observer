import { Bot, Request } from '../types';

export const FixtureBotsList: Record<string, Bot> = {
  a: {
    id: 'BOT_A',
  },
  b: {
    id: 'BOT_B',
  },
  c: {
    id: 'BOT_C',
  },
  d: {
    id: 'BOT_D',
  },
  e: {
    id: 'BOT_E',
  },
  f: {
    id: 'BOT_F',
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
