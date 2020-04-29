/*
 * Holding the state that should be passed through the zmenu component tree,
 * and yet is not global enough to merit lifting to redux
 */
import React, { useReducer, createContext, ReactNode } from 'react';
import { InstantDownloadTranscriptEntityProps } from 'src/shared/components/instant-download';
import noop from 'lodash/noop';

type InstantDownloadCache = {
  [key: string]: InstantDownloadTranscriptEntityProps;
};

type ZmenuContextState = {
  instantDownloadCache: InstantDownloadCache;
};

type ZmenuContextType = ZmenuContextState & {
  updateInstantDownloadCache: (payload: InstantDownloadCache) => void;
};

type UpdateInstantDownloadCacheAction = {
  type: 'update-instant-download-cache';
  payload: InstantDownloadCache;
};

type Action = UpdateInstantDownloadCacheAction;

const initialState: ZmenuContextState = {
  instantDownloadCache: {}
};

const reducer = (
  state: ZmenuContextState,
  action: Action
): ZmenuContextState => {
  switch (action.type) {
    case 'update-instant-download-cache': {
      return {
        ...state,
        instantDownloadCache: {
          ...state.instantDownloadCache,
          ...action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
};

const defaultContext: ZmenuContextType = {
  ...initialState,
  updateInstantDownloadCache: noop
};

export const ZmenuContext = createContext(defaultContext);

type ZmenuContextProviderProps = {
  children: ReactNode;
};

const ZmenuContextProvider = (props: ZmenuContextProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateInstantDownloadCache = (payload: InstantDownloadCache) =>
    dispatch({ type: 'update-instant-download-cache', payload });

  const context = {
    ...state,
    updateInstantDownloadCache
  };
  return (
    <ZmenuContext.Provider value={context}>
      {props.children}
    </ZmenuContext.Provider>
  );
};

export default ZmenuContextProvider;
