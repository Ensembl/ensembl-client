import { RootState } from 'src/store';
import { ChrLocation } from './browserState';

import { getQueryParamsMap } from 'src/global/globalHelper';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { getEnsObjectById } from 'src/ens-object/ensObjectSelectors';

export const getBrowserActivated = (state: RootState) =>
  state.browser.browserInfo.browserActivated;

export const getBrowserActiveGenomeId = (state: RootState) =>
  state.browser.browserEntity.activeGenomeId;

export const getBrowserActiveGenomeInfo = (state: RootState) => {
  const allGenomesInfo = getGenomeInfo(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? allGenomesInfo[activeGenomeId] : null;
};

export const getBrowserActiveEnsObjectIds = (state: RootState) =>
  state.browser.browserEntity.activeEnsObjectIds;

export const getBrowserActiveEnsObjectId = (state: RootState) => {
  const activeEnsObjectIds = getBrowserActiveEnsObjectIds(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? activeEnsObjectIds[activeGenomeId] : null;
};

export const getBrowserActiveEnsObject = (state: RootState) => {
  const activeObjectId = getBrowserActiveEnsObjectId(state);
  if (!activeObjectId) {
    return null;
  }
  return getEnsObjectById(state, activeObjectId);
};

export const getBrowserTrackStates = (state: RootState) =>
  state.browser.browserEntity.trackStates;

export const getBrowserQueryParams = (
  state: RootState
): { [key: string]: string } => getQueryParamsMap(state.router.location.search);

export const getBrowserNavOpened = (state: RootState) =>
  state.browser.browserNav.browserNavOpened;

export const getBrowserNavStates = (state: RootState) =>
  state.browser.browserNav.browserNavStates;

export const getAllChrLocations = (state: RootState) =>
  state.browser.browserLocation.chrLocations;

export const getChrLocation = (state: RootState): ChrLocation | null => {
  const chrLocations = getAllChrLocations(state);
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? chrLocations[activeGenomeId] : null;
};

export const getActualChrLocation = (state: RootState): ChrLocation | null => {
  const locations = state.browser.browserLocation.actualChrLocations;
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId ? locations[activeGenomeId] : null;
};

export const getDefaultChrLocation = (state: RootState): ChrLocation | null => {
  const activeEnsObjectId = getBrowserActiveEnsObjectId(state);
  const activeEnsObject =
    activeEnsObjectId && getEnsObjectById(state, activeEnsObjectId);
  if (!activeEnsObject) {
    return null;
  }
  const { chromosome, start, end } = activeEnsObject.location;

  return [chromosome, start, end];
};

export const getRegionEditorActive = (state: RootState) =>
  state.browser.browserLocation.regionEditorActive;

export const getRegionFieldActive = (state: RootState) =>
  state.browser.browserLocation.regionFieldActive;

export const getRegionValidationInfo = (state: RootState) =>
  state.browser.browserLocation.regionValidationInfo;

export const getRegionValidationLoadingStatus = (state: RootState) =>
  state.browser.browserLocation.regionValidationLoadingStatus;

export const getBrowserMessageCount = (state: RootState) =>
  state.browser.browserEntity.messageCounter;

export const getBrowserCogList = (state: RootState) =>
  state.browser.trackConfig.browserCogList;

export const getBrowserCogTrackList = (state: RootState) =>
  state.browser.trackConfig.browserCogTrackList;

export const getBrowserSelectedCog = (state: RootState) =>
  state.browser.trackConfig.selectedCog;

export const getTrackConfigNames = (state: RootState) =>
  state.browser.trackConfig.trackConfigNames;

export const getTrackConfigLabel = (state: RootState) =>
  state.browser.trackConfig.trackConfigLabel;

export const getApplyToAll = (state: RootState) =>
  state.browser.trackConfig.applyToAll;

export const isFocusObjectPositionDefault = (state: RootState) =>
  state.browser.browserLocation.isObjectInDefaultPosition;
