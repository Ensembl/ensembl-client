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

import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getTrackIds } from 'src/content/app/structural-variants/state/tracks/tracksSelectors';

import { setTracks } from 'src/content/app/structural-variants/state/tracks/tracksSlice';

const defaultTrackIds = ['sv-gene'];

/**
 * The purpose of this hook is to:
 * - Receive a list of track ids from the outside
 * - Check if redux has already registered track ids
 * - If not, store the received list of track ids in redux
 */

const useStoredTrackIds = (params: {
  referenceGenomeId: string;
  altGenomeId: string;
  referenceGenomeTrackIds: string[];
}) => {
  const { referenceGenomeId, altGenomeId, referenceGenomeTrackIds } = params;
  const trackIdsFromRedux = useAppSelector((state) => {
    return getTrackIds(state, referenceGenomeId, altGenomeId);
  });
  const dispatch = useAppDispatch();

  const hasTrackIdsInRedux =
    trackIdsFromRedux.referenceGenomeTrackIds.length > 0;

  useEffect(() => {
    if (!referenceGenomeTrackIds.length || hasTrackIdsInRedux) {
      return;
    }
    const allReferenceGenomeTrackIds = [
      ...defaultTrackIds,
      ...referenceGenomeTrackIds
    ];

    dispatch(
      setTracks({
        referenceGenomeId,
        altGenomeId,
        referenceGenomeTrackIds: allReferenceGenomeTrackIds,
        altGenomeTrackIds: defaultTrackIds
      })
    );
  }, [
    referenceGenomeId,
    altGenomeId,
    referenceGenomeTrackIds,
    hasTrackIdsInRedux,
    dispatch
  ]);
};

export default useStoredTrackIds;
