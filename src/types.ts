/* eslint-disable @typescript-eslint/ban-types */
export interface RequestIg {
  userId: number;
  targetUser: string;
  requestType: 'story' | 'higlight';
}

export interface Subsription {
  id: number;
  targetUser: string;
  actualStories: string[];
  subscribers: number[];
}

export interface IgResult {
  request: RequestIg;
  result?: Object;
  error?: Error;
}
export interface ResultMessage {
  toId: number;
  result?: Object;
  error?: Error;
}
