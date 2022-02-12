import { Request } from '../types';

export function addEndTimeToRequest(request: Request) {
  const endTime = new Date();
  const requestWithEndDates: Request = {
    ...request,
    endTime,
    duration: endTime.getTime() - request.startTime.getTime(),
  };
  return requestWithEndDates;
}
