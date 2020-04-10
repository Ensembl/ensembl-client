/*
 * This is a temporary file to adapt data sent from genome browser with bpane-zmenu event
 * to the needs of browser chrome (primarily as regards to the id format)
 */

import { parseFeatureId } from 'src/content/app/browser/browserHelper';

import { ZmenuIncomingPayload } from './zmenu-types';

export const processPayload = (
  payload: ZmenuIncomingPayload
): ZmenuIncomingPayload => {
  return JSON.parse(JSON.stringify(payload), (key, value) => {
    if (key === 'id') {
      return parseFeatureId(value);
    } else {
      return value;
    }
  });
};
