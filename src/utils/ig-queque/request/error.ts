import { Bot, Request } from '../types';

export class IgQuequeError extends Error {
  // private e: Error;
  constructor(public e: Error, public request: Request, public bot: Bot) {
    super(`Error ${e}`);
  }
}
