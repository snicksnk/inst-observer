export interface Bot {
  id: string;
  session: string;
}

export interface Request {
  targetUser: string;
  resolve: (result: any) => void;
}

export type createBot = () => Promise<Bot>;
