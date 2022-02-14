import { Observable } from "rxjs";

export interface Bot {
  id: string;
  session: string;
}

export interface Request<T = any> {
  targetUser: string;
  params?: Record<string, string | number>;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  process: (request: Request<T>, bot: Bot) => Promise<T>;
  resolve: (result: T) => void;
  reject: (error: Error) => void;
}

export type createBot = () => Promise<Bot>;
