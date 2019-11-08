import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import browser from '../content/app/browser/browserReducer';
import drawer from '../content/app/browser/drawer/drawerReducer';
import genome from '../shared/state/genome/genomeReducer';
import customDownload from '../content/app/custom-download/state/customDownloadReducer';
import global from '../global/globalReducer';
import header from '../header/headerReducer';
import ensObjects from '../shared/state/ens-object/ensObjectReducer';
import speciesSelector from '../content/app/species-selector/state/speciesSelectorReducer';

const rootReducer = (history: any) =>
  combineReducers({
    browser,
    drawer,
    customDownload,
    ensObjects,
    genome,
    global,
    header,
    router: connectRouter(history),
    speciesSelector
  });

export default rootReducer;
