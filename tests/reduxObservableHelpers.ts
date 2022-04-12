/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { takeUntil, finalize, Subject, type Observable } from 'rxjs';
import { combineEpics, type Epic } from 'redux-observable';
import type { Action } from '@reduxjs/toolkit';

import type { RootState } from 'src/store';

export const createCancellableTestEpic = (
  epics: Epic<Action, Action, RootState>[]
) => {
  const shutdown$ = new Subject<void>();

  const cancellableRootEpic = (
    action$: Observable<Action>,
    state$: Observable<RootState>,
    deps: any
  ) => {
    const rootEpic = combineEpics(...epics);

    const output$ = rootEpic(action$, state$ as any, deps);
    return output$.pipe(
      takeUntil(shutdown$),
      finalize(() => {
        shutdown$.complete();
      })
    );
  };

  return {
    rootEpic: cancellableRootEpic,
    shutdown$
  };
};
