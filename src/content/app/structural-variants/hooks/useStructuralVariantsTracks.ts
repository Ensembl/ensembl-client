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

import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

/**
 * NOTE:
 * This is a hack for getting relevant track ids from the full list of tracks
 * registered for a genome.
 */

const labelFragmentsForFindingTracks = [
  'short variants',
  'segmental duplication'
].map((string) => RegExp(string, 'i'));

/**
 * The purpose of this hook is to:
 * - Request track ids from the track api
 * - Select track ids that are relevant for the structural variants view
 */

const useTracksFromTrackApi = (params: {
  referenceGenomeId?: string | null;
  altGenomeId?: string | null;
}) => {
  const { referenceGenomeId } = params;
  const { currentData: referenceGenomeTracks } = useGenomeTracksQuery(
    referenceGenomeId ?? '',
    {
      skip: !referenceGenomeId
    }
  );

  const flattenedReferenceGenomeTracks = referenceGenomeTracks
    ? referenceGenomeTracks.flatMap((category) => category.track_list)
    : [];

  const relevantTracks = labelFragmentsForFindingTracks
    .map((regex) =>
      flattenedReferenceGenomeTracks.find((track) => regex.test(track.label))
    )
    .filter((track) => !!track);

  return {
    referenceGenomeTracks: relevantTracks
  };
};

export default useTracksFromTrackApi;
