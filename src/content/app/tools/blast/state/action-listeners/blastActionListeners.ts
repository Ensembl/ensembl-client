/**
 * 1. Listen to created submission
 *   - start polling for job results
 *   - save submission to IndexedDB
 * 2. Listen to restore redux state from IndexedDB
 * 
 * Thought: all our services can use globalThis instead of window to avoid errors
 */

import type { PayloadAction, ListenerEffectAPI } from '@reduxjs/toolkit';

import { submitBlast } from '../blast-api/blastApiSlice';

import type { BlastSubmission } from '../blast-results/blastResultsSlice';
import type { RootState, AppDispatch } from 'src/store';

export const submitBlastListener = {
  matcher: submitBlast.matchFulfilled,
  effect: async (action: PayloadAction<BlastSubmission>, listenerApi: ListenerEffectAPI<RootState, AppDispatch>) => {

  }
}

// export const onBlastSubmit = async (
//   action: PayloadAction<{
//     submissionId: string;
//     submission: BlastSubmission;
//   }>,
//   listenerApi: ListenerEffectAPI<RootState, AppDispatch>
// ) => {

// };

// listenerMiddleware.startListening({
//   // matcher: submitBlast.matchFulfilled,
//   // effect: onBlastSubmit
//   // effect: async (action, listenerApi) => {

//   // }
// });
