import {
  createListenerMiddleware,
  addListener,
  type TypedStartListening,
  type TypedAddListener
} from '@reduxjs/toolkit';

import type { RootState, AppDispatch } from '../store';

export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type Effect = Parameters<AppStartListening>[0]['effect'];

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;
