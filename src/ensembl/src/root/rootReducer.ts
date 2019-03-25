import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import browser from '../content/app/browser/browserReducer';
import drawer from '../content/app/browser/drawer/drawerReducer';
import global from '../global/globalReducer';
import header from '../header/headerReducer';
import object from '../object/objectReducer';
import trackPanel from '../content/app/browser/track-panel/trackPanelReducer';

const rootReducer = (history: any) =>
  combineReducers({
    browser,
    drawer,
    global,
    header,
    object,
    router: connectRouter(history),
    trackPanel
  });

export default rootReducer;
