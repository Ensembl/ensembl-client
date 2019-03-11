import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import global from './globalReducer';
import header from './header/headerReducer';
import browser from './content/app/browser/browserReducer';
import speciesSelector from './content/app/species-selector/state/speciesSelectorReducer';


const rootReducer = (history: any) =>
  combineReducers({
    browser,
    global,
    header,
    router: connectRouter(history),
    speciesSelector
  });

export default rootReducer;
