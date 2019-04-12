import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import browser from '../content/app/browser/browserReducer';
import drawer from '../content/app/browser/drawer/drawerReducer';
import customDownload from '../content/app/custom-download/customDownloadReducer';
import global from '../global/globalReducer';
import header from '../header/headerReducer';
import ensObject from '../ens-object/ensObjectReducer';
import trackPanel from '../content/app/browser/track-panel/trackPanelReducer';

const rootReducer = (history: any) =>
  combineReducers({
    browser,
    drawer,
    customDownload,
    ensObject,
    global,
    header,
    router: connectRouter(history),
    trackPanel
  });

export default rootReducer;
