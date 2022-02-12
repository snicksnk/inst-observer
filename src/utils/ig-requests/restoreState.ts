import { AndroidIgpapi } from '@igpapi/android';

export const restoreState = (state: string) => {
  const igpapi = new AndroidIgpapi({ state });

  return igpapi;
};
