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

import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { LoadingState } from 'src/shared/types/loading-state';

export const shouldFetch = (status: LoadingState) =>
  ![LoadingState.LOADING, LoadingState.SUCCESS].includes(status);

export const isNotFound = (error: FetchBaseQueryError | SerializedError | undefined) => {
  return error && 'status' in error && error.status === 404;
}

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined) => {
  if (error && 'data' in error && error.data && typeof error.data === 'object') {
    const { detail } = error.data as { detail?: string };
    if (detail) {
      return detail;
    }
  }
  return 'An unexpected error occurred..';
}
