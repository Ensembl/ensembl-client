import { ChrLocation } from './browserState';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

export function getChrLocationFromStr(chrLocationStr: string): ChrLocation {
  const [chrCode, chrRegion] = chrLocationStr.split(':');
  const [startBp, endBp] = chrRegion.split('-');

  return [chrCode, +startBp, +endBp];
}

export function getChrLocationStr(
  chrLocation: ChrLocation = ['', 0, 0]
): string {
  const [chrCode, startBp, endBp] = chrLocation;

  return `${chrCode}:${startBp}-${endBp}`;
}

export const resetBrowserTrackStates = () => {
  browserMessagingService.send('bpane', { default: true });
};
