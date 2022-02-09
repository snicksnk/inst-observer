export interface Bot {
  id: string;
  session: string;
}

export interface Request<T = any> {
  targetUser: string;
  resolve: (result: T) => void;
}

export type createBot = () => Promise<Bot>;
