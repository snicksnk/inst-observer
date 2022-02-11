import { Observable } from "rxjs";

export interface Bot {
  id: string;
  session: string;
}

export interface Request<T = any> {
  targetUser: string;
  process: (request: Request<T>, bot: Bot) => Observable<T>;
  resolve: (result: T) => void;
}

export type createBot = () => Promise<Bot>;
